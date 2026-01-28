import PageShell from "@/components/PageShell";
import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";

type SectionKey = "produce" | "fridge" | "cupboard" | "freezer";

type Item = { id: string; label: string };
type Section = { key: SectionKey; title: string; emoji: string; items: Item[] };

const LIST: Section[] = [
  {
    key: "produce",
    title: "Fresh Produce",
    emoji: "🥦",
    items: [
      { id: "apples", label: "Apples" },
      { id: "bananas", label: "Bananas" },
      { id: "carrots", label: "Carrots" },
      { id: "potatoes", label: "Potatoes" },
      { id: "onions", label: "Onions" },
      { id: "leafy", label: "Leafy greens (spinach / cabbage)" },
      { id: "seasonal", label: "Seasonal veg (what looks good today)" },
    ],
  },
  {
    key: "fridge",
    title: "Fridge",
    emoji: "🥩",
    items: [
      { id: "milk", label: "Milk" },
      { id: "eggs", label: "Eggs" },
      { id: "butter", label: "Butter" },
      { id: "cheese", label: "Cheese" },
      { id: "yogurt", label: "Yogurt" },
      { id: "meat", label: "Fresh meat or fish (for 2–3 meals only)" },
    ],
  },
  {
    key: "cupboard",
    title: "Cupboard",
    emoji: "🧂",
    items: [
      { id: "flour", label: "Flour" },
      { id: "rice", label: "Rice or pasta" },
      { id: "tomatoes", label: "Tinned tomatoes" },
      { id: "beans", label: "Beans or lentils" },
      { id: "oil", label: "Cooking oil" },
      { id: "saltpepper", label: "Salt & pepper" },
    ],
  },
  {
    key: "freezer",
    title: "Freezer (only if needed)",
    emoji: "❄️",
    items: [
      { id: "frozveg", label: "Frozen vegetables" },
      { id: "frozfruit", label: "Frozen fruit" },
      { id: "bread", label: "Bread (spare loaf)" },
    ],
  },
];

const STORAGE_KEY = "gmk_shopping_ticks_v1";

export default function ShoppingList() {
  const [ticks, setTicks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTicks(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  function setAndSave(next: Record<string, boolean>) {
    setTicks(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  function toggle(id: string) {
    setAndSave({ ...ticks, [id]: !ticks[id] });
  }

  function clearAll() {
    setAndSave({});
  }

  const total = useMemo(() => LIST.reduce((a, s) => a + s.items.length, 0), []);
  const done = useMemo(() => Object.values(ticks).filter(Boolean).length, [ticks]);

  return (
    <PageShell>
      <Helmet>
        <title>Shopping List | Grandma&apos;s Kitchen</title>
        <meta name="description" content="A calm click-to-tick shopping list — no clutter." />
        <link rel="canonical" href="https://grandmaskitchen.org/shopping-list" />
      </Helmet>

      <div className="py-10">
        <div className="gmk-panel">
          <h1 className="gmk-h2" style={{ marginBottom: 6 }}>
            🧺 My Shopping List
          </h1>
          <p className="text-muted-foreground" style={{ marginTop: 0 }}>
            A quiet, simple list — just like Grandma used.
          </p>

          <div className="gmk-shop-meta">
            <span>{done}/{total} ticked</span>
            <button type="button" className="gmk-shop-clear" onClick={clearAll}>
              Clear ticks
            </button>
          </div>
        </div>

        <div className="gmk-shop-grid">
          {LIST.map((sec) => (
            <section key={sec.key} className="gmk-panel gmk-shop-card">
              <h2 className="gmk-shop-h3">
                <span aria-hidden="true">{sec.emoji}</span> {sec.title}
              </h2>

              <ul className="gmk-shop-list">
                {sec.items.map((it) => (
                  <li key={it.id} className="gmk-shop-item">
                    <button
                      type="button"
                      onClick={() => toggle(it.id)}
                      className={["gmk-shop-check", ticks[it.id] ? "is-on" : ""].join(" ")}
                      aria-label={ticks[it.id] ? `Untick ${it.label}` : `Tick ${it.label}`}
                    />
                    <span className={["gmk-shop-label", ticks[it.id] ? "is-on" : ""].join(" ")}>
                      {it.label}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="gmk-panel" style={{ marginTop: 18 }}>
          <h2 className="gmk-h2" style={{ marginBottom: 6 }}>
            ✏️ Notes to myself
          </h2>
          <ul className="gmk-how" style={{ marginTop: 0 }}>
            <li><span className="gmk-how-icon">✅</span><span>Check cupboards before buying</span></li>
            <li><span className="gmk-how-icon">✅</span><span>Buy what I’ll actually use</span></li>
            <li><span className="gmk-how-icon">✅</span><span>Keep it simple</span></li>
            <li><span className="gmk-how-icon">🍬</span><span>Leave room for one small treat</span></li>
          </ul>
        </div>
      </div>
    </PageShell>
  );
}
