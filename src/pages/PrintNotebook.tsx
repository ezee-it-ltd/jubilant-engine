import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  loadState,
  type GMKItem,
  type LocationKey,
  formatExpiryShort,
} from "@/lib/gmk-storage";

function group(items: GMKItem[], loc: LocationKey) {
  return items
    .filter((i) => i.location === loc)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export default function PrintNotebook() {
  const [items, setItems] = useState<GMKItem[]>([]);
  const navigate = useNavigate();

  // Capture a single “printed at” timestamp for this session
  const printedAt = useMemo(() => {
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

  useEffect(() => {
    setItems(loadState().items);

    const onAfterPrint = () => {
      // Return to notebook whether they printed or cancelled
      navigate("/notebook");
    };

    window.addEventListener("afterprint", onAfterPrint);
    return () => window.removeEventListener("afterprint", onAfterPrint);
  }, [navigate]);

  const cupboard = useMemo(() => group(items, "cupboard"), [items]);
  const fridge = useMemo(() => group(items, "fridge"), [items]);
  const freezer = useMemo(() => group(items, "freezer"), [items]);

  return (
    <main className="gmk-page">
      <div className="gmk-printpage">
        {/* Toolbar (visible on screen, hidden on printed output) */}
        <div className="gmk-print-toolbar gmk-noprint">
          <button
            type="button"
            className="gmk-print-btn"
            onClick={() => window.print()}
            aria-label="Print"
            title="Print"
          >
            🖨️ Print
          </button>

          <Link to="/notebook" className="gmk-print-home">
            ← Back to notebook
          </Link>
        </div>

        {/* Header */}
        <div className="gmk-print-header">
          <img
            src="/images/grandma-head.png"
            alt="Grandma’s Kitchen"
            className="gmk-print-logo"
          />
          <div>
            <div className="gmk-print-title">Grandma’s Kitchen — Notebook</div>
            <div className="gmk-print-sub">
              Printed on {printedAt} · grandmaskitchen.org
            </div>
          </div>
        </div>

        <hr className="gmk-print-rule" />

        <div className="gmk-print-sections">
          <Section title="CUPBOARD" items={cupboard} />
          <Section title="FRIDGE" items={fridge} />
          <Section title="FREEZER" items={freezer} />
        </div>

        {/* Footer shown on-screen + print (page numbering added via CSS) */}
        <div className="gmk-print-footer">
          © {new Date().getFullYear()} Grandma’s Kitchen · grandmaskitchen.org
          <span className="gmk-print-pagenum" />
        </div>
      </div>
    </main>
  );
}

function Section({ title, items }: { title: string; items: GMKItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="gmk-print-section">
      <div className="gmk-print-h2">{title}</div>

      <ul className="gmk-print-list">
        {items.map((i) => (
          <li className="gmk-print-item" key={i.id}>
            <span className="gmk-print-check" aria-hidden="true" />
            <div>
              <div className="gmk-print-name">
                {i.name} — {i.quantity} {i.unit ?? ""}
              </div>
              {i.expiry ? (
                <div className="gmk-print-muted">
                  Use by: {formatExpiryShort(i.expiry)}
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
