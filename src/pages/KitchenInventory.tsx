import PageShell from "@/components/PageShell";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Archive, Refrigerator, Snowflake, Trash2 } from "lucide-react";

import {
  migrateNotebookEndToEnd,
  saveNotebookUnified,
  type InventoryStateV1,
} from "@/lib/notebookMigration";

type Location = "cupboard" | "fridge" | "freezer";

type InventoryItem = {
  id: string;
  item_name: string;
  created_at: string;
};

type InventoryState = InventoryStateV1;

function emptyState(): InventoryState {
  return { cupboard: [], fridge: [], freezer: [] };
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const LOCAL_KEY = "gmk_inventory_v1";
const LOCAL_BACKUP_KEY = "gmk_inventory_backup_before_restore";

export default function KitchenInventory() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Location>("cupboard");
  const [newItem, setNewItem] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [inv, setInv] = useState<InventoryState>(() => emptyState());

  const grouped = useMemo(() => inv, [inv]);

  useEffect(() => {
    migrateNotebookEndToEnd()
      .then((res) => {
        setInv(res.notebook.inventory);
        if (res.didMigrate) setMessage("Your notebook is up to date everywhere.");
      })
      .catch(() => {
        // silent fail
      });
  }, []);

  async function persist(next: InventoryState, msg?: string) {
    setInv(next);
    try {
      await saveNotebookUnified(next);
      if (msg) setMessage(msg);
    } catch {
      // UI still updates; keep calm message if provided
      if (msg) setMessage(msg);
    }
  }

  function tabLabel(loc: Location) {
    return loc === "cupboard" ? "Cupboards" : loc === "fridge" ? "Fridge" : "Freezer";
  }

  function tabIcon(loc: Location) {
    if (loc === "cupboard") return <Archive className="h-4 w-4" />;
    if (loc === "fridge") return <Refrigerator className="h-4 w-4" />;
    return <Snowflake className="h-4 w-4" />;
  }

  function addItem() {
    setMessage(null);
    const name = newItem.trim();
    if (!name) return;

    const item: InventoryItem = {
      id: makeId(),
      item_name: name,
      created_at: new Date().toISOString(),
    };

    const next: InventoryState = {
      ...inv,
      [activeTab]: [item, ...inv[activeTab]],
    };

    void persist(next, "Saved to your notebook.");
    setNewItem("");
  }

  function deleteItem(id: string) {
    setMessage(null);
    const next: InventoryState = {
      ...inv,
      [activeTab]: inv[activeTab].filter((x) => x.id !== id),
    };
    void persist(next);
  }

  function clearAll() {
    setMessage(null);
    void persist(emptyState(), "Notebook cleared.");
  }

  function restoreFromLocal() {
    setMessage(null);

    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) {
      setMessage("No local copy found on this device.");
      return;
    }

    try {
      const parsed = JSON.parse(raw) as InventoryState;
      localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(inv));
      void persist(parsed, "Notebook restored from this device.");
    } catch {
      setMessage("Local copy could not be restored.");
    }
  }

  return (
    <PageShell>
      <Helmet>
        <title>Your Notebook | Grandma&apos;s Kitchen</title>
        <meta
          name="description"
          content="Your cupboards, fridge, and freezer — in one calm notebook."
        />
        <link rel="canonical" href="https://grandmaskitchen.org/inventory" />
      </Helmet>

      <div className="py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Button variant="ghost" className="rounded-xl" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Button variant="ghost" className="rounded-xl" onClick={clearAll}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear all
          </Button>
        </div>

        <h1 className="text-3xl font-serif font-bold mb-2">Your Notebook</h1>

        <p className="text-muted-foreground mb-4 max-w-xl">
          This is your kitchen list — cupboards, fridge, and freezer — kept simple on purpose.
        </p>

        {message && (
          <div className="mb-4 p-3 rounded-xl border border-input bg-white/60 text-sm">
            {message}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {(["cupboard", "fridge", "freezer"] as Location[]).map((loc) => {
            const isActive = activeTab === loc;
            return (
              <button
                key={loc}
                type="button"
                onClick={() => setActiveTab(loc)}
                className={["gmk-tab", `gmk-tab--${loc}`, isActive ? "is-active" : ""].join(" ")}
              >
                {tabIcon(loc)}
                {tabLabel(loc)}
              </button>
            );
          })}
        </div>

        <div className="gmk-panel">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className="flex-1 rounded-xl border border-input bg-white/70 px-4 py-3"
              placeholder={`Add to ${tabLabel(activeTab).toLowerCase()}…`}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addItem();
              }}
            />
            <Button className="rounded-xl px-6" onClick={addItem}>
              Add
            </Button>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          {grouped[activeTab].length === 0 ? (
            <p className="text-sm text-muted-foreground">No items yet.</p>
          ) : (
            grouped[activeTab].map((i) => (
              <div key={i.id} className="gmk-inv-item rounded-2xl border border-input bg-white/60">
                <Button
                  type="button"
                  variant="outline"
                  className="gmk-inv-delete"
                  onClick={() => deleteItem(i.id)}
                >
                  Delete
                </Button>
                <div className="gmk-inv-name">{i.item_name}</div>
              </div>
            ))
          )}
        </div>

        <div className="mt-10 gmk-panel">
          <h3 className="font-serif font-semibold mb-2">Safety copy</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-xl">
            If something ever looks wrong, you can restore the notebook saved on this device.
          </p>
          <Button variant="outline" className="rounded-full" onClick={restoreFromLocal}>
            Restore from this device
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
