export type LocationKey = "cupboard" | "fridge" | "freezer";

export type GMKItem = {
  id: string;
  name: string;
  location: LocationKey;
  quantity: number;
  unit?: string;
  expiry?: string; // YYYY-MM-DD (optional)
  addedAt: number;
};

export type GMKState = {
  version: 1;
  items: GMKItem[];
  shoppingList: string[]; // unique item names user flagged
};

const KEY = "gmk-mach01";

const emptyState: GMKState = {
  version: 1,
  items: [],
  shoppingList: [],
};

export function loadState(): GMKState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw) as GMKState;
    if (!parsed || parsed.version !== 1) return emptyState;
    return {
      ...emptyState,
      ...parsed,
      items: Array.isArray(parsed.items) ? parsed.items : [],
      shoppingList: Array.isArray(parsed.shoppingList) ? parsed.shoppingList : [],
    };
  } catch {
    return emptyState;
  }
}

export function saveState(state: GMKState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function uid() {
  return Math.random().toString(36).slice(2) + "-" + Date.now().toString(36);
}

export function normaliseName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

export function isExpired(yyyyMmDd?: string) {
  if (!yyyyMmDd) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const d = new Date(yyyyMmDd + "T00:00:00");
  if (isNaN(d.getTime())) return false;

  return d < today;
}

export function formatExpiryShort(yyyyMmDd?: string) {
  if (!yyyyMmDd) return "";
  const d = new Date(yyyyMmDd + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  // "Tue 04 Feb"
  return d.toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "short" });
}
