import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Archive, Refrigerator, Snowflake } from "lucide-react";

type Location = "cupboard" | "fridge" | "freezer";

type InventoryRow = {
  id: string;
  user_id: string;
  location: Location;
  item_name: string;
  quantity: number | null;
  unit: string | null;
  expiry_date: string | null;
  created_at: string;
};

export default function KitchenInventory() {
  const navigate = useNavigate();

  const [debug, setDebug] = useState("booting...");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<Location>("cupboard");
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState<InventoryRow[]>([]);

  const grouped = useMemo(
    () => ({
      cupboard: items.filter((i) => i.location === "cupboard"),
      fridge: items.filter((i) => i.location === "fridge"),
      freezer: items.filter((i) => i.location === "freezer"),
    }),
    [items]
  );

  const loadItems = useCallback(async (uid: string) => {
    const { data, error: loadErr } = await supabase
      .from("inventory_items")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (loadErr) {
      setError(loadErr.message);
      return;
    }

    setItems((data ?? []) as InventoryRow[]);
  }, []);

  const setLoggedOutState = useCallback((dbg: string) => {
    setDebug(dbg);
    setUserId(null);
    setItems([]);
    setError("Please log in to access your kitchen inventory.");
  }, []);

  useEffect(() => {
    let alive = true;

    async function boot() {
      setLoading(true);
      setError(null);

      const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
      if (!alive) return;

      if (sessionErr) {
        setDebug("getSession error: " + sessionErr.message);
        setError("Could not check login status. Please refresh and try again.");
        setLoading(false);
        return;
      }

      const session = sessionData.session;
      const uid = session?.user?.id ?? null;

      if (!uid) {
        setLoggedOutState("NO SESSION (not logged in)");
        setLoading(false);
        return;
      }

      setDebug("SESSION OK user=" + (session?.user?.email ?? "unknown") + " id=" + uid);
      setUserId(uid);

      await loadItems(uid);
      if (!alive) return;

      setLoading(false);
    }

    boot();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;

      const uid = session?.user?.id ?? null;

      if (!uid) {
        setLoggedOutState("AUTH CHANGE -> NO SESSION");
        return;
      }

      setDebug("AUTH CHANGE -> SESSION OK user=" + (session.user.email ?? "unknown") + " id=" + uid);
      setUserId(uid);
      setError(null);
      loadItems(uid);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, [loadItems, setLoggedOutState]);

  async function addItem() {
    setError(null);

    const name = newItem.trim();
    if (!name) return;

    if (!userId) {
      setError("Not logged in. Go to /login and sign in.");
      return;
    }

    const { data, error: insErr } = await supabase
      .from("inventory_items")
      .insert({
        user_id: userId,
        location: activeTab,
        item_name: name,
      })
      .select()
      .single();

    if (insErr) {
      setError(insErr.message);
      return;
    }

    if (data) {
      setItems((prev) => [data as InventoryRow, ...prev]);
      setNewItem("");
    }
  }

  async function deleteItem(id: string) {
    setError(null);

    const { error: delErr } = await supabase.from("inventory_items").delete().eq("id", id);

    if (delErr) {
      setError(delErr.message);
      return;
    }

    setItems((prev) => prev.filter((x) => x.id !== id));
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
        <meta
          name="description"
          content="Track what you have in your cupboards, fridge, and freezer."
        />
        <link rel="canonical" href="https://grandmaskitchen.org/inventory" />
      </Helmet>

      {/* DEBUG PANEL (remove later) */}
      <div className="mb-4 p-3 rounded-xl border border-input bg-white/50 text-xs text-muted-foreground">
        {debug}
      </div>

      <div className="mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </button>
      </div>

      <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-3">
        Your Kitchen Inventory
      </h1>

      <p className="text-muted-foreground mb-8 leading-relaxed max-w-2xl">
        Add items to your cupboards, fridge, and freezer so you always know what you have in the house.
      </p>

      {loading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : (
        <>
          {error && (
            <div className="mb-4 p-3 rounded-xl border border-red-500/40 bg-red-500/10">
              {error}
              <div className="mt-3">
                <Button className="rounded-xl" onClick={() => navigate("/login")}>
                  Go to Login
                </Button>
              </div>
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
              placeholder={"Add an item to your " + tabLabel(activeTab).toLowerCase() + "..."}
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

          <p className="text-xs text-muted-foreground mt-8 text-center">
            Base Camp #1: This inventory is stored securely in your account.
          </p>
        </>
      )}
    </div>
  );
}
