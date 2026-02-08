import PageShell from "@/components/PageShell";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { loadState, saveState } from "@/lib/gmk-storage";

function keyOf(name: string) {
  return name.trim().toLowerCase();
}

export default function ShoppingList() {
  const nav = useNavigate();

  const [hydrated, setHydrated] = useState(false);
  const [items, setItems] = useState<string[]>([]);
  const [ticked, setTicked] = useState<Record<string, boolean>>({});

  // Load once
  useEffect(() => {
    const st = loadState();
    setItems(st.shoppingList ?? []);
    setHydrated(true);
  }, []);

  // Persist list changes only (ticks are intentionally device-only + not persisted)
  useEffect(() => {
    if (!hydrated) return;
    const st = loadState();
    saveState({ ...st, version: 1, shoppingList: items });
  }, [hydrated, items]);

  const sorted = useMemo(() => [...items].sort((a, b) => a.localeCompare(b)), [items]);

  function toggle(name: string) {
    const k = keyOf(name);
    setTicked((prev) => ({ ...prev, [k]: !prev[k] }));
  }

  function clearTicks() {
    setTicked({});
  }

  function removeFromList(name: string) {
    const k = keyOf(name);

    setItems((prev) => prev.filter((x) => keyOf(x) !== k));
    setTicked((prev) => {
      const next = { ...prev };
      delete next[k];
      return next;
    });
  }

  const doneCount = useMemo(() => Object.values(ticked).filter(Boolean).length, [ticked]);

  const metaDateTime = useMemo(() => {
    const d = new Date();
    return d.toLocaleString(undefined, {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  return (
    <PageShell>
      <Helmet>
        <title>Shopping List | Grandma&apos;s Kitchen</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="py-10">
        {/* Match the print-page width so it visually feels consistent */}
        <div className="gmk-printpage">
          {/* Toolbar (screen only) */}
          <div className="gmk-print-toolbar gmk-noprint">
            <Link to="/notebook" className="gmk-print-home">
              ← Back to notebook
            </Link>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <Button variant="outline" onClick={clearTicks}>
                Clear ticks
              </Button>

              <Button variant="outline" onClick={() => nav("/print-shopping-list")}>
                🖨️ Print Shopping List
              </Button>

              <Button variant="outline" onClick={() => nav("/print/all")}>
                🖨️ Print Notebook
              </Button>
            </div>
          </div>

          {/* Header (screen) */}
          <header className="gmk-print-header gmk-noprint">
            <img className="gmk-print-logo" src="/images/grandma-head.png" alt="Grandma’s Kitchen" />
            <div>
              <div className="gmk-print-title">My Shopping List</div>
              <div className="gmk-print-sub">
                {sorted.length} item{sorted.length === 1 ? "" : "s"} · {doneCount} ticked · {metaDateTime} ·
                {" "}grandmaskitchen.org
              </div>
            </div>
          </header>

          <hr className="gmk-print-rule gmk-noprint" />

          {/* Content card */}
          {sorted.length === 0 ? (
            <div className="gmk-print-empty">
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Nothing on the list yet.</div>
              <div className="gmk-print-muted">
                In your notebook, tap <strong>“Need more”</strong> to add items here.
              </div>
            </div>
          ) : (
            <section className="gmk-print-section">
              <ul className="gmk-print-list">
                {sorted.map((name) => {
                  const on = !!ticked[keyOf(name)];
                  return (
                    <li key={name} className="gmk-print-item">
                      <button
                        type="button"
                        className={["gmk-shop-check", on ? "is-on" : ""].join(" ")}
                        aria-pressed={on}
                        onClick={() => toggle(name)}
                        title="Tick item"
                      />
                      <div>
                        <div className={["gmk-print-name", on ? "gmk-print-muted" : ""].join(" ")}>
                          {name}
                        </div>

                        <button
                          type="button"
                          className="mt-2 text-xs font-semibold underline underline-offset-4 opacity-70 hover:opacity-100 gmk-noprint"
                          onClick={() => removeFromList(name)}
                          title="Remove from shopping list"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="gmk-shop-meta gmk-noprint" style={{ marginTop: 14 }}>
                <div>
                  {sorted.length} item{sorted.length === 1 ? "" : "s"} · {doneCount} ticked
                </div>

                <button type="button" className="gmk-shop-clear" onClick={clearTicks}>
                  Clear ticks
                </button>
              </div>
            </section>
          )}

          {/* Footer */}
          <div className="gmk-print-footer">
            © {new Date().getFullYear()} Grandma’s Kitchen · grandmaskitchen.org
          </div>
        </div>
      </div>
    </PageShell>
  );
}
