import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";

import AddItemDialog from "@/components/AddItemDialog";
import {
  type GMKItem,
  type LocationKey,
  loadState,
  saveState,
  isExpired,
  formatExpiryShort,
} from "@/lib/gmk-storage";

type TabKey = LocationKey | "all";

export default function Notebook() {
  const nav = useNavigate();

  const [tab, setTab] = useState<TabKey>("cupboard");
  const [items, setItems] = useState<GMKItem[]>([]);
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [addOpen, setAddOpen] = useState(false);

  // ✅ prevents “first render save” from wiping storage
  const [hydrated, setHydrated] = useState(false);

  // load once
  useEffect(() => {
    const st = loadState();
    setItems(st.items ?? []);
    setShoppingList(st.shoppingList ?? []);
    setHydrated(true);
  }, []);

  // persist on change (ONLY after hydration)
  useEffect(() => {
    if (!hydrated) return;
    saveState({ version: 1, items, shoppingList });
  }, [hydrated, items, shoppingList]);

  const visible = useMemo(() => {
    const list = tab === "all" ? items : items.filter((i) => i.location === tab);
    return [...list].sort((a, b) => b.addedAt - a.addedAt);
  }, [items, tab]);

  function addItem(item: GMKItem) {
    setItems((prev) => [item, ...prev]);
  }

  function toggleNeedMore(name: string) {
    const key = name.trim();
    if (!key) return;

    setShoppingList((prev) => {
      const has = prev.some((n) => n.toLowerCase() === key.toLowerCase());
      if (has) return prev.filter((n) => n.toLowerCase() !== key.toLowerCase());
      return [...prev, key];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <main className="gmk-page">
      <div className="gmk-container">
        {/* Top line */}
        <div className="gmk-notebook-top">
          <Link to="/" className="gmk-backlink">
            ← Home
          </Link>

          <div className="gmk-notebook-head">
            <h1 className="gmk-title">My Kitchen Notebook</h1>
            <p className="gmk-subtitle">Saved on this device. Private.</p>
          </div>
        </div>

        {/* Tabs + actions */}
        <div className="gmk-notebook-bar">
          <div className="gmk-tabs" role="tablist" aria-label="Notebook sections">
            <button
              className={`gmk-tab ${tab === "cupboard" ? "is-active" : ""}`}
              onClick={() => setTab("cupboard")}
              type="button"
            >
              Cupboard
            </button>
            <button
              className={`gmk-tab ${tab === "fridge" ? "is-active" : ""}`}
              onClick={() => setTab("fridge")}
              type="button"
            >
              Fridge
            </button>
            <button
              className={`gmk-tab ${tab === "freezer" ? "is-active" : ""}`}
              onClick={() => setTab("freezer")}
              type="button"
            >
              Freezer
            </button>
            <button
              className={`gmk-tab ${tab === "all" ? "is-active" : ""}`}
              onClick={() => setTab("all")}
              type="button"
            >
              All
            </button>
          </div>

          <div className="gmk-actions">
            <Button variant="outline" onClick={() => nav("/shopping-list")}>
              Display Shopping List
            </Button>

            <Button variant="outline" onClick={() => nav("/print/all")}>
              Display Notebook
            </Button>
          </div>
        </div>

        {/* Card */}
        <section className="gmk-panel gmk-notebook-card">
          <div className="gmk-muted">
            {tab === "all" ? "Everything you’ve written down." : `Your ${tab}.`}
          </div>

          <hr className="gmk-rule" />

          {visible.length === 0 ? (
            <div className="gmk-empty">
              <div className="gmk-empty-title">Nothing written yet.</div>
              <p className="gmk-empty-sub">
                Tap <strong>Add item</strong> and start with the basics — eggs, milk, bread.
              </p>
            </div>
          ) : (
            <div className="gmk-list">
              {visible.map((i) => {
                const expired = isExpired(i.expiry);
                const inList = shoppingList.some(
                  (n) => n.toLowerCase() === i.name.toLowerCase()
                );

                return (
                  <div key={i.id} className="gmk-row">
                    <div className="gmk-row-left">
                      <div className="gmk-item-title">
                        {i.name}
                        {i.quantity ? ` — ${i.quantity} ${i.unit ?? ""}` : ""}
                      </div>

                      {i.expiry ? (
                        <div className={`gmk-expiry ${expired ? "gmk-expired" : ""}`}>
                          Use by: {formatExpiryShort(i.expiry)}
                          {expired ? " (expired)" : ""}
                        </div>
                      ) : null}

                      <button
                        className="gmk-row-link"
                        onClick={() => removeItem(i.id)}
                        type="button"
                        title="Remove this line from your notebook"
                      >
                        Remove
                      </button>
                    </div>

                    <button
                      className={`gmk-needmore ${inList ? "is-on" : ""}`}
                      onClick={() => toggleNeedMore(i.name)}
                      type="button"
                      aria-pressed={inList}
                      title="Add/remove from shopping list"
                    >
                      {inList ? "☑ On list" : "✓ Need more"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="gmk-bottom">
            <Button className="gmk-candy-btn" onClick={() => setAddOpen(true)}>
              + Add item
            </Button>

            <div className="gmk-muted">
              {items.length} item{items.length === 1 ? "" : "s"} · {shoppingList.length} on list
            </div>
          </div>
        </section>

        <AddItemDialog
          open={addOpen}
          onOpenChange={setAddOpen}
          defaultLocation={tab === "all" ? "cupboard" : tab}
          onCreate={addItem}
        />
      </div>
    </main>
  );
}
