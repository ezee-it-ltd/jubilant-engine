import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Archive, Refrigerator, Snowflake, Trash2 } from "lucide-react";

type Location = "cupboard" | "fridge" | "freezer";

type InventoryItem = {
  id: string;
  item_name: string;
  created_at: string;
};

type InventoryState = Record<Location, InventoryItem[]>;

const STORAGE_KEY = "gmk_inventory_v1";

function emptyState(): InventoryState {
  return { cupboard: [], fridge: [], freezer: [] };
}

function loadState(): InventoryState {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyState();

  try {
    const parsed = JSON.parse(raw) as Partial<InventoryState>;
    return {
      cupboard: Array.isArray(parsed.cupboard) ? parsed.cupboard : [],
      fridge: Array.isArray(parsed.fridge) ? parsed.fridge : [],
      freezer: Array.isArray(parsed.freezer) ? parsed.freezer : [],
    };
  } catch {
    return emptyState();
  }
}

function saveState(state: InventoryState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function KitchenInventory() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Location>("cupboard");
  const [newItem, setNewItem] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const [inv, setInv] = useState<InventoryState>(() => loadState());

  const grouped = useMemo(() => inv, [inv]);

  function persist(next: InventoryState) {
    setInv(next);
    saveState(next);
  }

  function tabLabel(loc: Location) {
    if (loc === "cupboard") return "Cupboards";
    if (loc === "fridge") return "Fridge";
    return "Freezer";
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

    persist(next);
    setNewItem("");
    setMessage("Saved on this device.");
  }

  function deleteItem(id: string) {
    setMessage(null);

    const next: InventoryState = {
      ...inv,
      [activeTab]: inv[activeTab].filter((x) => x.id !== id),
    };

    persist(next);
  }

  function clearAll() {
    setMessage(null);
    const next = emptyState();
    persist(next);
    setMessage("All cleared.");
  }

  return (
    <div className="py-10">
      <Helmet>
        <title>Your Inventory | Grandma&apos;s Kitchen</title>
        <meta name="description" content="Track what you have in your cupboards, fridge, and freezer." />
        <link rel="canonical" href="https://grandmaskitchen.org/inventory" />
      </Helmet>

      <div className="mb-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>

        <Button variant="ghost" className="rounded-xl" onClick={clearAll}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear all
        </Button>
      </div>

      <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-3">
        Your Kitchen Inventory
      </h1>

      <p className="text-muted-foreground mb-2 leading-relaxed max-w-2xl">
        Add items to your cupboards, fridge, and freezer so you always know what you have in the house.
      </p>

      <p className="text-xs text-muted-foreground mb-6 max-w-2xl">
        Saved privately on this device. No login required.
      </p>

      {message && (
        <div className="mb-4 p-3 rounded-xl border border-input bg-white/60 text-sm">
          {message}
        </div>
      )}

      <div className="flex gap-2 mb-6">
        {(["cupboard", "fridge", "freezer"] as Location[]).map((loc) => (
          <button
            key={loc}
            onClick={() => setActiveTab(loc)}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border ${
              activeTab === loc ? "font-semibold bg-white/60" : "opacity-80"
            }`}
          >
            {tabIcon(loc)}
            {tabLabel(loc)}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-8">
        <input
          className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm"
          placeholder={`Add an item to your ${tabLabel(activeTab).toLowerCase()}...`}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") addItem();
          }}
        />
        <Button className="rounded-xl px-5" onClick={addItem}>
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {grouped[activeTab].length === 0 ? (
          <div className="text-sm text-muted-foreground">No items yet.</div>
        ) : (
          grouped[activeTab].map((i) => (
            <div
              key={i.id}
              className="rounded-2xl border border-input bg-white/60 p-4 flex items-center justify-between"
            >
              <div className="font-medium">{i.item_name}</div>
              <button
                className="text-sm text-muted-foreground hover:text-foreground"
                onClick={() => deleteItem(i.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
