import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";

type KitchenPayload = {
  cupboard: string;
  fridge: string;
  freezer: string;
  createdAt: string;
};

function lines(text: string) {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function Result() {
  const navigate = useNavigate();

  const data = useMemo<KitchenPayload | null>(() => {
    try {
      const raw = localStorage.getItem("gmk_kitchen_v1");
      return raw ? (JSON.parse(raw) as KitchenPayload) : null;
    } catch {
      return null;
    }
  }, []);

  const cupboardItems = useMemo(() => lines(data?.cupboard ?? ""), [data]);
  const fridgeItems = useMemo(() => lines(data?.fridge ?? ""), [data]);
  const freezerItems = useMemo(() => lines(data?.freezer ?? ""), [data]);

  const handleReset = () => {
    localStorage.removeItem("gmk_kitchen_v1");
    navigate("/kitchen");
  };

  return (
    <div className="py-10">
      <Helmet>
        <title>Tonight&apos;s Suggestion | Grandma&apos;s Kitchen</title>
        <meta
          name="description"
          content="Grandma suggests a simple meal based on what you have in your kitchen."
        />
        <link rel="canonical" href="https://grandmaskitchen.org/result" />
      </Helmet>

      <div className="mb-8 flex items-center justify-between gap-3">
        <Link
          to="/kitchen"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Kitchen
        </Link>

        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Clear &amp; start again
        </Button>
      </div>

      <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">
        Grandma&apos;s suggestion
      </h1>

      {!data ? (
        <div className="rounded-2xl border border-input bg-white/60 p-6">
          <p className="text-muted-foreground mb-4">
            I can&apos;t see your kitchen list yet.
          </p>
          <Button asChild className="rounded-full px-8 py-6">
            <Link to="/kitchen">Go to Kitchen</Link>
          </Button>
        </div>
      ) : (
        <>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Based on what you&apos;ve got, here&apos;s a simple idea for tonight.
            (Project 1: placeholder suggestion — we add the real “magic button”
            next.)
          </p>

          <div className="rounded-2xl border border-input bg-white/60 p-6 mb-8">
            <h2 className="font-semibold mb-2">Tonight, I’d make:</h2>
            <p className="text-lg">
              A simple “use-what-you’ve-got” pasta or rice bowl — built around
              your cupboard basics and any veg or protein you listed.
            </p>

            <h3 className="font-semibold mt-5 mb-2">Method (simple):</h3>
            <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
              <li>Pick a base: pasta or rice.</li>
              <li>Add one veg from the fridge/freezer.</li>
              <li>
                Add one protein if you have it (chicken, tuna, eggs, beans).
              </li>
              <li>Season with what you’ve got (salt, pepper, herbs, etc.).</li>
              <li>
                Finish with a sauce (tomatoes, stock, a splash of milk/cheese)
                if available.
              </li>
            </ol>
          </div>

          <div className="grid gap-6">
            <div className="rounded-2xl border border-input bg-white/60 p-6">
              <h2 className="font-semibold mb-3">
                What you told Grandma you have
              </h2>

              <div className="space-y-6 text-sm">
                <div>
                  <div className="font-medium mb-1">Cupboards</div>
                  {cupboardItems.length ? (
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {cupboardItems.map((item, i) => (
                        <li key={`c-${i}-${item}`}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-muted-foreground">None listed</div>
                  )}
                </div>

                <div>
                  <div className="font-medium mb-1">Fridge</div>
                  {fridgeItems.length ? (
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {fridgeItems.map((item, i) => (
                        <li key={`f-${i}-${item}`}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-muted-foreground">None listed</div>
                  )}
                </div>

                <div>
                  <div className="font-medium mb-1">Freezer</div>
                  {freezerItems.length ? (
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {freezerItems.map((item, i) => (
                        <li key={`z-${i}-${item}`}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-muted-foreground">None listed</div>
                  )}
                </div>
              </div>
            </div>

            <Button asChild size="lg" className="w-full rounded-full py-6 text-base">
              <Link to="/kitchen">Try a different list</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
