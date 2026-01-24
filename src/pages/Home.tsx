import PageShell from "@/components/PageShell";

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <PageShell>
      <Helmet>
        <title>Grandma&apos;s Kitchen | What&apos;s already in your kitchen?</title>
        <meta
          name="description"
          content="Keep a simple list of what’s in your cupboards, fridge, and freezer. Stop buying what you already have."
        />
        <link rel="canonical" href="https://grandmaskitchen.org/" />
      </Helmet>

      <div className="py-10">
        {/* HERO */}
        <div className="gmk-hero">
          <img
            src="/hero-kitchen.jpg"
            alt="Grandma cooking in a warm kitchen"
            loading="eager"
          />
        </div>

        <h1 className="gmk-h1">What&apos;s already in your kitchen?</h1>

        <p className="gmk-lead gmk-dropcap">
          Stop buying what you already have. Keep a simple list of what&apos;s in your cupboards,
          fridge, and freezer — saved privately on this device.
        </p>

        {/* Primary actions */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mt-4">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/inventory">
              Open My Inventory <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="rounded-full px-6">
            <Link to="/kitchen">
              Ask Grandma <Sparkles className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-3">
          No login. No account. Nothing uploaded.
        </p>

        <hr className="gmk-rule" />

        {/* WHY */}
        <section className="gmk-panel">
          <h2 className="gmk-h2">Why Grandma&apos;s Kitchen?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Most of us don&apos;t waste food because we&apos;re careless. We waste it because we
            forget what we already have.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            This is a calm place to write things down — before you go shopping, before you order
            online, before you buy another one “just in case”.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            No scanning. No rules. No guilt. Just a list you trust.
          </p>
        </section>

        <hr className="gmk-rule" />

        {/* HOW IT WORKS */}
        <section className="gmk-panel">
          <h2 className="gmk-h2">How it works</h2>

          <ul className="space-y-3 text-muted-foreground leading-relaxed">
            <li>
              <span className="mr-2">🧺</span>
              Open your inventory and pick a section (Cupboards / Fridge / Freezer)
            </li>
            <li>
              <span className="mr-2">✍️</span>
              Add what you already have (rough lists are fine)
            </li>
            <li>
              <span className="mr-2">✅</span>
              Check it before you shop — stop duplicates
            </li>
          </ul>

          <div className="mt-6">
            <Button asChild className="rounded-full">
              <Link to="/inventory">Open My Inventory</Link>
            </Button>
          </div>
        </section>

        <hr className="gmk-rule" />

        {/* FOR YOU IF */}
        <section className="gmk-panel">
          <h2 className="gmk-h2">This is for you if…</h2>

          <p className="text-muted-foreground leading-relaxed mt-2">
            If any of these sound like you, you&apos;re exactly who this was built for.
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
  {[
    {
      bubble: "Have you ever bought it twice, love?",
      img: "/for-you/bought-duplicate.png",
      alt: "Shopping bag with items already owned",
    },
    {
      bubble: "Less clutter. You don’t need another app.",
      img: "/for-you/less-clutter.png",
      alt: "Phone overflowing with app icons",
    },
    {
      bubble: "No posting online — keep it in the house.",
      img: "/for-you/no-account.png",
      alt: "Phone with social icons crossed out next to notebook",
    },
    {
      bubble: "Simple and quiet. That’s the way.",
      img: "/for-you/simple-and-quiet.png",
      alt: "Tea cup, book, candle, and calm desk scene",
    },
  ].map((c, idx) => (
    <div key={c.bubble} className="gmk-foryou-card">
      <div className="gmk-illus-wrap">
        <img src={c.img} alt={c.alt} loading="lazy" className="gmk-illus" />

        {/* Bubble sits ON the card (attached) */}
        <div className={`gmk-bubble gmk-bubble--overlay ${idx % 2 === 0 ? "left" : "right"}`}>
          {c.bubble}
        </div>
      </div>
    </div>
  ))}
</div>

          <p className="text-muted-foreground leading-relaxed mt-5">
            If you want automation, syncing, or clever tricks — this isn&apos;t that. This is Base
            Camp.
          </p>
        </section>

        <hr className="gmk-rule" />

        {/* PRIVACY */}
        <section className="gmk-panel">
          <h2 className="gmk-h2">Your kitchen stays yours</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your list is stored locally on your device. Nothing is uploaded. Nothing is tracked.
            Nothing is shared.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            If you clear your browser, the list clears too — just like a notebook.
          </p>
        </section>

        <hr className="gmk-rule" />

        {/* CLOSE */}
        <section className="gmk-panel">
          <p className="text-lg leading-relaxed">
            <span className="font-serif font-bold">Grandma didn&apos;t need an app.</span>{" "}
            She needed a list.
          </p>

          <div className="mt-4 flex flex-col sm:flex-row gap-6">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/inventory"> Open My Inventory </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="rounded-full px-8">
              <Link to="/kitchen"> Ask Grandma </Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-3">Base Camp #1 — simple on purpose.</p>

          <div className="text-xs opacity-60 mt-2">
            Build: {import.meta.env.VITE_BUILD_ID ?? "no-build-id"}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
