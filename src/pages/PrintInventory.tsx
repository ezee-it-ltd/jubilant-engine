import PageShell from "@/components/PageShell";
import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";

import { migrateNotebookEndToEnd, type InventoryStateV1 } from "@/lib/notebookMigration";

type LocationKey = "cupboard" | "fridge" | "freezer";
type Scope = "cupboards" | "fridge" | "freezer" | "all";

type InventoryState = InventoryStateV1;

function emptyState(): InventoryState {
  return { cupboard: [], fridge: [], freezer: [] };
}

function isScope(x: unknown): x is Scope {
  return x === "cupboards" || x === "fridge" || x === "freezer" || x === "all";
}

function titleForScope(scope: Scope) {
  if (scope === "cupboards") return "Cupboards";
  if (scope === "fridge") return "Fridge";
  if (scope === "freezer") return "Freezer";
  return "All";
}

function sectionKeysForScope(scope: Scope): LocationKey[] {
  if (scope === "cupboards") return ["cupboard"];
  if (scope === "fridge") return ["fridge"];
  if (scope === "freezer") return ["freezer"];
  return ["cupboard", "fridge", "freezer"];
}

function labelForKey(k: LocationKey) {
  if (k === "cupboard") return "Cupboards";
  if (k === "fridge") return "Fridge";
  return "Freezer";
}

export default function PrintInventory() {
  const navigate = useNavigate();
  const { scope: rawScope } = useParams<{ scope?: string }>();

  const scope: Scope = isScope(rawScope) ? rawScope : "all";

  const [inv, setInv] = useState<InventoryState>(() => emptyState());
  const [loading, setLoading] = useState(true);

  // ✅ Unified load (same source of truth as Inventory page)
  useEffect(() => {
    let alive = true;

    migrateNotebookEndToEnd()
      .then((res) => {
        if (!alive) return;
        setInv(res.notebook.inventory);
      })
      .catch(() => {
        // silent: keep emptyState
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, []);

  const keys = useMemo(() => sectionKeysForScope(scope), [scope]);

  const printable = useMemo(() => {
    return keys.map((k) => ({
      key: k,
      label: labelForKey(k),
      // oldest first reads nicer on paper
      items: (inv[k] || []).slice().reverse(),
    }));
  }, [inv, keys]);

  const totalCount = useMemo(
    () => printable.reduce((acc, s) => acc + s.items.length, 0),
    [printable]
  );

  const today = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
    []
  );

  return (
    <PageShell>
      <Helmet>
        <title>Print Inventory ({titleForScope(scope)}) | Grandma&apos;s Kitchen</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="py-10 gmk-printpage">
        {/* On-screen controls (hidden in print) */}
        <div className="mb-6 flex items-center justify-between gap-3 gmk-noprint">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>

          <Button onClick={() => window.print()} className="rounded-xl">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>

        {/* Print header */}
        <header className="gmk-print-header">
          <img className="gmk-print-logo" src="/icon/grandma-512.png" alt="Grandma’s Kitchen" />
          <div className="gmk-print-headtext">
            <div className="gmk-print-title">Grandma’s Kitchen — Inventory</div>
            <div className="gmk-print-sub">
              {titleForScope(scope)} • {today} • grandmaskitchen.org
            </div>
          </div>
        </header>

        <hr className="gmk-print-rule" />

        {loading ? (
          <div className="gmk-print-empty">Loading your notebook…</div>
        ) : totalCount === 0 ? (
          <div className="gmk-print-empty">
            Nothing in your list yet. Pop back and add a few items, love.
          </div>
        ) : (
          <div className="gmk-print-sections">
            {printable.map((sec) => (
              <section key={sec.key} className="gmk-print-section">
                <h2 className="gmk-print-h2">{sec.label}</h2>

                {sec.items.length === 0 ? (
                  <div className="gmk-print-muted">No items.</div>
                ) : (
                  <ul className="gmk-print-list">
                    {sec.items.map((it) => (
                      <li key={it.id} className="gmk-print-item">
                        <span className="gmk-print-check" aria-hidden="true" />
                        <span className="gmk-print-name">{it.item_name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        )}

        <footer className="gmk-print-footer">
          <div className="gmk-print-muted">
            Tip: keep it simple — write it down once, then check it before you shop.
          </div>
        </footer>
      </div>
    </PageShell>
  );
}
