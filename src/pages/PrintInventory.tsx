import PageShell from "@/components/PageShell";
import { Helmet } from "react-helmet-async";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer } from "lucide-react";

type LocationKey = "cupboard" | "fridge" | "freezer";
type Scope = "cupboards" | "fridge" | "freezer" | "all";

type InventoryItem = {
  id: string;
  item_name: string;
  created_at: string;
};

type InventoryState = Record<LocationKey, InventoryItem[]>;

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

export default function PrintInventory() {
  const navigate = useNavigate();
  const params = useParams();
  const scope = (params.scope as Scope) || "all";

  const inv = useMemo(() => loadState(), []);
  const keys = sectionKeysForScope(scope);

  const printable = useMemo(() => {
    return keys.map((k) => ({
      key: k,
      label: k === "cupboard" ? "Cupboards" : k === "fridge" ? "Fridge" : "Freezer",
      items: (inv[k] || []).slice().reverse(), // oldest first reads nicer on paper
    }));
  }, [inv, scope]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalCount = printable.reduce((acc, s) => acc + s.items.length, 0);
  const today = new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });

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

        {/* Print header (shows on paper, can also show on screen) */}

        <header className="gmk-print-header">
          {/* Put your logo file here (recommend: /logo-gmk.png) */}
          <img className="gmk-print-logo" src="/icon/grandma-512.png" alt="Grandma’s Kitchen" />
          <div className="gmk-print-headtext">
            <div className="gmk-print-title">Grandma’s Kitchen — Inventory</div>
            <div className="gmk-print-sub">
              {titleForScope(scope)} • {today} • grandmaskitchen.org
            </div>
          </div>
        </header>

        <hr className="gmk-print-rule" />

        {totalCount === 0 ? (
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

        {/* Print footer */}
        <footer className="gmk-print-footer">
          <div className="gmk-print-muted">
            Tip: keep it simple — write it down once, then check it before you shop.
          </div>
        </footer>
      </div>
    </PageShell>
  );
}
