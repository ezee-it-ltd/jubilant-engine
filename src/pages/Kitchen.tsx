import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import {
  Archive,
  ArrowLeft,
  Refrigerator,
  Snowflake,
  Sparkles,
} from "lucide-react";

export default function Kitchen() {
  const navigate = useNavigate();

  const [cupboard, setCupboard] = useState("");
  const [fridge, setFridge] = useState("");
  const [freezer, setFreezer] = useState("");

  const handleAskGrandma = () => {
    const payload = {
      cupboard: cupboard.trim(),
      fridge: fridge.trim(),
      freezer: freezer.trim(),
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("gmk_kitchen_v1", JSON.stringify(payload));
    navigate("/result");
  };

  return (
    <div className="py-10">
      <Helmet>
        <title>Your Kitchen | Grandma&apos;s Kitchen</title>
        <meta
          name="description"
          content="Add what you have in your cupboards, fridge, and freezer. Then ask Grandma what to cook tonight."
        />
        <link rel="canonical" href="https://grandmaskitchen.org/kitchen" />
      </Helmet>

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
        What&apos;s in your kitchen?
      </h1>

      <p className="text-muted-foreground mb-10 leading-relaxed max-w-2xl">
        List what you have — Grandma will suggest a simple meal using these
        ingredients. Don&apos;t worry about spelling. Rough lists are fine.
      </p>

      <div className="space-y-8">
        <section className="rounded-2xl border border-input bg-white/60 p-6">
          <label className="flex items-center gap-2 font-semibold mb-2">
            <Archive className="h-4 w-4 text-emerald-700" />
            Cupboards
          </label>
          <p className="text-sm text-muted-foreground mb-3">
            Tins, pasta, rice, spices, sauces, etc. (one item per line)
          </p>
          <textarea
            value={cupboard}
            onChange={(e) => setCupboard(e.target.value)}
            rows={6}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-200"
            placeholder={`Example:\nPasta\nChopped tomatoes\nTuna\nRice\nCurry powder`}
          />
        </section>

        <section className="rounded-2xl border border-input bg-white/60 p-6">
          <label className="flex items-center gap-2 font-semibold mb-2">
            <Refrigerator className="h-4 w-4 text-emerald-700" />
            Fridge
          </label>
          <p className="text-sm text-muted-foreground mb-3">
            Fresh veg, dairy, leftovers, etc. (one item per line)
          </p>
          <textarea
            value={fridge}
            onChange={(e) => setFridge(e.target.value)}
            rows={6}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-200"
            placeholder={`Example:\nEggs\nMilk\nCheddar\nOnions\nSpinach`}
          />
        </section>

        <section className="rounded-2xl border border-input bg-white/60 p-6">
          <label className="flex items-center gap-2 font-semibold mb-2">
            <Snowflake className="h-4 w-4 text-emerald-700" />
            Freezer
          </label>
          <p className="text-sm text-muted-foreground mb-3">
            Meat, frozen veg, bread, etc. (one item per line)
          </p>
          <textarea
            value={freezer}
            onChange={(e) => setFreezer(e.target.value)}
            rows={6}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-200"
            placeholder={`Example:\nChicken thighs\nFrozen peas\nFrozen mixed veg\nBread`}
          />
        </section>

        <div className="pt-2">
          <Button
            size="lg"
            className="w-full rounded-full py-6 text-base"
            onClick={handleAskGrandma}
          >
            Ask Grandma
            <Sparkles className="ml-2 h-4 w-4" />
          </Button>

          <p className="text-xs text-muted-foreground mt-3 text-center">
            Project 1: This stays on your device for now. No account needed.
          </p>
        </div>
      </div>
    </div>
  );
}
