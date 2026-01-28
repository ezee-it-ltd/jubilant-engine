// src/lib/notebookMigration.ts
//
// End-to-end localStorage -> Supabase migration for Grandma’s Kitchen “Notebook”.
// - Keeps localStorage as backup (never auto-deletes)
// - One notebook per user (row keyed by user_id)
// - Conflict resolution: higher version wins, else newer updated_at wins, else remote wins
// - Safe + idempotent: can be called on every app start / auth change
//
// Assumptions:
// - localStorage key: "gmk_inventory_v1"
// - Supabase table: "notebooks" with columns:
//   user_id (uuid, unique), ciphertext (text), version (int), updated_at (timestamptz)
// - You already have `supabase` client created (imported below)

import { supabase } from "@/integrations/supabase/client";

export type InventoryStateV1 = {
  cupboard: { id: string; item_name: string; created_at: string }[];
  fridge: { id: string; item_name: string; created_at: string }[];
  freezer: { id: string; item_name: string; created_at: string }[];
};

export type NotebookV1 = {
  // versioning for sync/conflict resolution
  version: number;
  updated_at: string; // ISO string
  inventory: InventoryStateV1;
};

type NotebookRow = {
  user_id: string;
  ciphertext: string;
  version: number;
  updated_at: string;
};

export type NotebookSource = "local" | "supabase";

const LOCAL_KEY = "gmk_inventory_v1";
const LOCAL_ARCHIVE_KEY = "gmk_inventory_archived_v1";

function nowISO() {
  return new Date().toISOString();
}

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function emptyInventory(): InventoryStateV1 {
  return { cupboard: [], fridge: [], freezer: [] };
}

function normalizeLocalToNotebookV1(raw: any): NotebookV1 {
  // You may have stored InventoryState directly (older code) OR NotebookV1.
  // This normalizes both into NotebookV1.

  // Case: already NotebookV1
  if (
    raw &&
    typeof raw === "object" &&
    typeof raw.version === "number" &&
    typeof raw.updated_at === "string" &&
    raw.inventory &&
    typeof raw.inventory === "object"
  ) {
    return {
      version: raw.version,
      updated_at: raw.updated_at,
      inventory: {
        cupboard: Array.isArray(raw.inventory.cupboard) ? raw.inventory.cupboard : [],
        fridge: Array.isArray(raw.inventory.fridge) ? raw.inventory.fridge : [],
        freezer: Array.isArray(raw.inventory.freezer) ? raw.inventory.freezer : [],
      },
    };
  }

  // Case: InventoryState directly
  const inv: InventoryStateV1 = {
    cupboard: Array.isArray(raw?.cupboard) ? raw.cupboard : [],
    fridge: Array.isArray(raw?.fridge) ? raw.fridge : [],
    freezer: Array.isArray(raw?.freezer) ? raw.freezer : [],
  };

  // Build a notebook wrapper
  return {
    version: 1,
    updated_at: nowISO(),
    inventory: inv,
  };
}

function loadLocalNotebook(): NotebookV1 | null {
  const raw = safeJsonParse<any>(localStorage.getItem(LOCAL_KEY));
  if (!raw) return null;
  return normalizeLocalToNotebookV1(raw);
}

function saveLocalNotebook(notebook: NotebookV1) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(notebook));
}

function archiveLocalNotebookOnce() {
  // Optional helper: keeps a copy of the local notebook (one-time) for safety.
  const existingArchive = localStorage.getItem(LOCAL_ARCHIVE_KEY);
  if (existingArchive) return;

  const raw = localStorage.getItem(LOCAL_KEY);
  if (raw) localStorage.setItem(LOCAL_ARCHIVE_KEY, raw);
}

function parseRemoteNotebook(row: NotebookRow): NotebookV1 | null {
  const raw = safeJsonParse<any>(row.ciphertext);
  if (!raw) return null;

  // Remote might store either NotebookV1 or InventoryState; normalize:
  const notebook = normalizeLocalToNotebookV1(raw);

  // Prefer DB version/updated_at if present (canonical)
  return {
    ...notebook,
    version: typeof row.version === "number" ? row.version : notebook.version ?? 1,
    updated_at: typeof row.updated_at === "string" ? row.updated_at : notebook.updated_at ?? nowISO(),
  };
}

function isNewer(local: NotebookV1, remote: NotebookV1) {
  // Primary: version
  if ((local.version ?? 0) !== (remote.version ?? 0)) {
    return (local.version ?? 0) > (remote.version ?? 0);
  }

  // Secondary: updated_at timestamp
  const lt = Date.parse(local.updated_at || "");
  const rt = Date.parse(remote.updated_at || "");
  if (!Number.isNaN(lt) && !Number.isNaN(rt) && lt !== rt) {
    return lt > rt;
  }

  // Default: remote wins ties (safer for multi-device)
  return false;
}

async function fetchRemoteRow(userId: string): Promise<NotebookRow | null> {
  const { data, error } = await supabase
    .from("notebooks")
    .select("user_id,ciphertext,version,updated_at")
    .eq("user_id", userId)
    .maybeSingle();

  // maybeSingle() returns null data if no row; that's fine
  if (error) throw error;
  return (data as NotebookRow | null) ?? null;
}

async function upsertRemoteRow(userId: string, notebook: NotebookV1): Promise<void> {
  const row = {
    user_id: userId,
    ciphertext: JSON.stringify(notebook),
    version: notebook.version,
    updated_at: notebook.updated_at,
  };

  // upsert ensures "one notebook per user"
  const { error } = await supabase.from("notebooks").upsert(row, { onConflict: "user_id" });
  if (error) throw error;
}

/**
 * migrateNotebookEndToEnd()
 *
 * Call this after app start and whenever auth state changes.
 * Returns:
 * - source: where the app should read/write going forward
 * - notebook: the canonical notebook chosen after merge
 */
export async function migrateNotebookEndToEnd(): Promise<{
  source: NotebookSource;
  notebook: NotebookV1;
  didMigrate: boolean;
  action: "local-only" | "pushed-local-to-remote" | "pulled-remote-to-local" | "created-remote" | "no-change";
}> {
  // 1) Read local first (always)
  const local = loadLocalNotebook() ?? {
    version: 1,
    updated_at: nowISO(),
    inventory: emptyInventory(),
  };

  // 2) Check auth
  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser();

  if (userErr) {
    // Stay local if auth lookup fails (silent + safe)
    return { source: "local", notebook: local, didMigrate: false, action: "local-only" };
  }

  if (!user) {
    // Not logged in: keep local as source of truth
    return { source: "local", notebook: local, didMigrate: false, action: "local-only" };
  }

  const userId = user.id;

  // 3) Fetch remote
  const remoteRow = await fetchRemoteRow(userId);

  // 4) If no remote notebook: create it from local (first login)
  if (!remoteRow) {
    // Keep a safety archive copy of local once we start syncing
    archiveLocalNotebookOnce();

    // Bump version to mark the “first sync”
    const toRemote: NotebookV1 = {
      ...local,
      version: Math.max(1, local.version ?? 1),
      updated_at: nowISO(),
    };

    await upsertRemoteRow(userId, toRemote);

    // Also normalize local to match what we just wrote
    saveLocalNotebook(toRemote);

    return { source: "supabase", notebook: toRemote, didMigrate: true, action: "created-remote" };
  }

  // 5) Parse remote notebook
  const remoteNotebook = parseRemoteNotebook(remoteRow);

  // If remote ciphertext is unreadable, treat local as canonical and overwrite remote
  if (!remoteNotebook) {
    archiveLocalNotebookOnce();

    const toRemote: NotebookV1 = {
      ...local,
      version: Math.max(1, local.version ?? 1),
      updated_at: nowISO(),
    };

    await upsertRemoteRow(userId, toRemote);
    saveLocalNotebook(toRemote);

    return { source: "supabase", notebook: toRemote, didMigrate: true, action: "pushed-local-to-remote" };
  }

  // 6) Conflict resolution
  // If local newer -> push local to remote
  if (isNewer(local, remoteNotebook)) {
    archiveLocalNotebookOnce();

    const next: NotebookV1 = {
      ...local,
      // ensure we advance version and timestamp when pushing
      version: Math.max((remoteNotebook.version ?? 1) + 1, (local.version ?? 1)),
      updated_at: nowISO(),
    };

    await upsertRemoteRow(userId, next);
    saveLocalNotebook(next);

    return { source: "supabase", notebook: next, didMigrate: true, action: "pushed-local-to-remote" };
  }

  // If remote newer (or tie) -> pull remote to local
  // (This is what solves laptop vs phone divergence.)
  if (!isNewer(local, remoteNotebook)) {
    archiveLocalNotebookOnce();

    // Trust remote’s version/updated_at
    saveLocalNotebook(remoteNotebook);

    // Optional: if local had differences but remote won, we can still keep archive (done above)
    // No need to write remote again.
    const changed =
      JSON.stringify(local.inventory) !== JSON.stringify(remoteNotebook.inventory) ||
      (local.version ?? 0) !== (remoteNotebook.version ?? 0);

    return {
      source: "supabase",
      notebook: remoteNotebook,
      didMigrate: changed,
      action: changed ? "pulled-remote-to-local" : "no-change",
    };
  }

  // Fallback (shouldn’t hit)
  return { source: "supabase", notebook: remoteNotebook, didMigrate: false, action: "no-change" };
}

/**
 * Helper to save updates after migration:
 * - If logged in: writes to Supabase + updates local backup
 * - If logged out: writes to local only
 */
export async function saveNotebookUnified(nextInventory: InventoryStateV1) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Load current local notebook wrapper
  const current = loadLocalNotebook() ?? {
    version: 1,
    updated_at: nowISO(),
    inventory: emptyInventory(),
  };

  const next: NotebookV1 = {
    version: Math.max(1, (current.version ?? 1) + 1),
    updated_at: nowISO(),
    inventory: nextInventory,
  };

  // Always keep local as backup
  saveLocalNotebook(next);

  if (!user) return;

  await upsertRemoteRow(user.id, next);
}
