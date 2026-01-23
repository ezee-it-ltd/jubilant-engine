import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Archive, Refrigerator, Snowflake, Download, Upload, Trash2 } from "lucide-react";

type Location = "cupboard" | "fridge" | "freezer";

type InventoryItem = {
  id: string;            // local id
  item_name: string;
  created_at: string;    // ISO string
};

type InventoryState = Record<Location, InventoryItem[]>;

const STORAGE_KEY = "gmk_inventory_v1";

function safeParseInventory(raw: string | null): InventoryState {
  const empty: InventoryState = { cupboard: [], fridge: [], freezer: [] };
  if (!raw) return empty;

  try {
    const parsed = JSON.parse(raw) as Partial<InventoryState>;
    return {
      cupboard: Array.isArray(parsed.cupboard) ? parsed.cupboard : [],
      fridge: Array.isArray(parsed.fridge) ? parsed.fridge : [],
      freezer: Array.isArray(parsed.freezer) ? parsed.freezer : [],
    };
  } catch {
    return empty;
  }
}

function makeId() {
  // Good enough for local use
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function KitchenInventory() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Location>("cupboard");
  const [newItem, setNewItem] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  // Load once at startup
  const [inv, setInv] = useState<InventoryState>(() =>
    safeParseInventory(localStorage.getItem(STORAGE_KEY))
  );

  const grouped = useMemo(() => inv, [inv]);

  function persist(next: InventoryState) {
    setInv(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function addItem() {
    setMsg(null);

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
    setMsg("Saved on this device.");
  }

  function deleteItem(id: string) {
    setMsg(null);

    const next: InventoryState = {
      ...inv,
      [activeTab]: inv[activeTab].filter((x) => x.id !== id),
    };

    persist(next);
  }

  function clearAll() {
    setMsg(null);

    const next: InventoryState = { cupboard: [], fridge: [], freezer: [] };
    persist(next);
    setMsg("Cleared.");
  }

  async function exportJSON() {
    setMsg(null);

    const blob = new Blob([JSON.stringify(inv, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "grandmas-kitchen-inventory.json";
    a.click();

    URL.revokeObjectURL(url);
    setMsg("Exported JSON.");
  }

  async function importJSON(file: File | null) {
    setMsg(null);
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = safeParseInventory(text);

      // Light validation: ensure correct shape
      const next: InventoryState = {
        cupboard: Array.isArray(parsed.cupboard) ? parsed.cupboard : [],
        fridge: Array.isArray(parsed.fridge) ? parsed.fridge : [],
        freezer: Array.isArray(parsed.freezer) ? parsed.freezer : [],
      };

      persist(next);
      setMsg("Imported JSON.");
    } catch {
      setMsg("Import failed. That file does not look like valid inventory JSON.");
    }
  }

  const tabLabel = (loc: Location) => {
    if (loc === "cupboard") return "Cupboards";
    if (loc === "fridge") return "Fridge";
    return "Freezer";
  };

  const tabIcon = (loc: Location) => {
    if (loc === "cupboard") return <Archive className="h-4 w-4" />;
    if (loc === "fridge") return <Refrigerator className="h-4 w-4" />;
    return <Snowflake className="h-4 w-4" />;
  };

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

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <Button variant="outline" className="rounded-xl" onClick={exportJSON}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <label className="inline-flex">
            <span className="sr-only">Import JSON</span>
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => importJSON(e.target.files?.[0] ?? null)}
            />
            <span className="inline-flex items-center cursor-pointer px-3 py-2 rounded-xl border border-input bg-background text-sm hover:bg-muted">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </span>
          </label>

          <Button variant="ghost" className="rounded-xl" onClick={clearAll}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear all
          </Button>
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-3">
        Your Kitchen Inventory
      </h1>

      <p className="text-muted-foreground mb-4 leading-relaxed max-w-2xl">
        Add items to your cupboards, fridge, and freezer so you always know what you have in the house.
      </p>

      <p className="text-xs text-muted-foreground mb-8 max-w-2xl">
        Saved privately on this device. (Later we can add accounts to sync across devices.)
      </p>

      {msg && (
        <div className="mb-4 p-3 rounded-xl border border-input bg-white/60 text-sm">
          {msg}
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
