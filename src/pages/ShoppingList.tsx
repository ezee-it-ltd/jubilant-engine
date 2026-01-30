import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { loadState, saveState } from "@/lib/gmk-storage";

export default function ShoppingList() {
  const [list, setList] = useState<string[]>([]);
  const [ticked, setTicked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const st = loadState();
    setList(st.shoppingList);
  }, []);

  const sorted = useMemo(() => {
    return [...list].sort((a, b) => a.localeCompare(b));
  }, [list]);

  function toggle(name: string) {
    setTicked((p) => ({ ...p, [name]: !p[name] }));
  }

  function clearTicked() {
    // Remove ticked items from the shopping list (calm behaviour)
    const remaining = list.filter((n) => !ticked[n]);
    setList(remaining);
    setTicked({});

    const st = loadState();
    saveState({ ...st, shoppingList: remaining });
  }

  return (
    <main className="gmk-page">
      <div className="flex items-center justify-between gap-4">
        <Link to="/notebook" className="text-sm font-semibold underline underline-offset-4">
          ← Back to Notebook
        </Link>
        <main className="gmk-page">
  <div className="gmk-container">
    <h1 className="gmk-h1">My Shopping List</h1>

    <div className="gmk-panel gmk-shop-panel">
      ...
    </div>
  </div>
</main>

      <div className="mt-5 gmk-card p-5 sm:p-6">
        {sorted.length === 0 ? (
          <div className="py-8 text-center">
            <div className="gmk-h1 text-2xl">Nothing on the list.</div>
            <p className="gmk-muted mt-2">Use “Need more” inside your notebook.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((name) => {
              const isOn = !!ticked[name];
              return (
                <button
                  key={name}
                  className="w-full text-left rounded-xl border border-black/10 bg-white/55 px-4 py-4 text-lg font-semibold transition"
                  onClick={() => toggle(name)}
                  aria-pressed={isOn}
                >
                  <span className="mr-3">{isOn ? "☑" : "☐"}</span>
                  <span className={isOn ? "opacity-50 line-through" : ""}>{name}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" className="w-full sm:w-auto" onClick={() => window.print()}>
            Print List
          </Button>
          <Button variant="outline" className="w-full sm:w-auto" onClick={clearTicked} disabled={sorted.length === 0}>
            Clear ticked
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/notebook">Back to Notebook</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
