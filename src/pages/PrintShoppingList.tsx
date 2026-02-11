import PageShell from "@/components/PageShell";
import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadState } from "@/lib/gmk-storage";

export default function PrintShoppingList() {
  const nav = useNavigate();
  const [items, setItems] = useState<string[]>([]);

  // capture a single timestamp for this print session
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
    const st = loadState();
    setItems(st.shoppingList ?? []);

    // Return after print/cancel
    const onAfterPrint = () => {
      nav("/shopping-list");
    };

    window.addEventListener("afterprint", onAfterPrint);
    return () => window.removeEventListener("afterprint", onAfterPrint);
  }, [nav]);

  const sorted = useMemo(() => [...items].sort((a, b) => a.localeCompare(b)), [items]);

  return (
    <PageShell>
      <Helmet>
        <title>Print Shopping List | Grandma&apos;s Kitchen</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="py-10 gmk-printpage">
        {/* Toolbar (screen only) */}
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

          <Link to="/shopping-list" className="gmk-print-home">
            ← Back to shopping list
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
            <div className="gmk-print-title">My Shopping List</div>
            <div className="gmk-print-sub">
              Printed on {printedAt} · grandmaskitchen.org
            </div>
          </div>
        </div>

        <hr className="gmk-print-rule" />

        {sorted.length === 0 ? (
          <div className="gmk-print-empty">Nothing on your list yet.</div>
        ) : (
          <section className="gmk-print-section">
            <ul className="gmk-print-list">
              {sorted.map((name) => (
                <li key={name} className="gmk-print-item">
                  <span className="gmk-print-check" aria-hidden="true" />
                  <span className="gmk-print-name">{name}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="gmk-print-footer">
          © {new Date().getFullYear()} Grandma’s Kitchen · grandmaskitchen.org
          <span className="gmk-print-pagenum" />
        </div>
      </div>
    </PageShell>
  );
}
