import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="py-10">
      <Helmet>
        <title>Grandma&apos;s Kitchen | What&apos;s in your kitchen?</title>
        <meta
          name="description"
          content="Keep a simple list of what’s in your cupboards, fridge, and freezer. Stop buying what you already have."
        />
        <link rel="canonical" href="https://grandmaskitchen.org/" />
      </Helmet>

      <section className="max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight mb-4">
          What&apos;s already in your kitchen?
        </h1>

        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
          Stop buying what you already have. Keep a simple list of what&apos;s in your cupboards,
          fridge, and freezer.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-3">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/inventory">Open My Kitchen</Link>
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mb-10">
          No login. No account. Saved privately on this device.
        </p>

        <div className="space-y-10">
          <section className="rounded-2xl border border-input bg-white/60 p-6">
            <h2 className="text-xl font-serif font-bold mb-3">Why Grandma&apos;s Kitchen?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Most of us don&apos;t waste food because we&apos;re careless. We waste it because we
              forget what we already have.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Grandma&apos;s Kitchen is a calm place to write things down — before you go shopping,
              before you order online, before you buy another one “just in case”.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              No scanning. No rules. No guilt. Just a list you trust.
            </p>
          </section>

          <section className="rounded-2xl border border-input bg-white/60 p-6">
            <h2 className="text-xl font-serif font-bold mb-3">How it works</h2>
            <ol className="space-y-3 text-muted-foreground leading-relaxed">
              <li>
                <span className="font-semibold text-foreground">1) Open your kitchen</span>
              </li>
              <li>
                <span className="font-semibold text-foreground">2) Add what you already have</span>
                <div className="mt-1 text-sm">
                  Cupboards • Fridge • Freezer
                </div>
              </li>
              <li>
                <span className="font-semibold text-foreground">3) Check it before you shop</span>
              </li>
            </ol>
            <div className="mt-6">
              <Button asChild className="rounded-full">
                <Link to="/inventory">Open My Kitchen</Link>
              </Button>
            </div>
          </section>

          <section className="rounded-2xl border border-input bg-white/60 p-6">
            <h2 className="text-xl font-serif font-bold mb-3">This is for you if…</h2>
            <ul className="space-y-2 text-muted-foreground leading-relaxed">
              <li>• You&apos;ve ever bought something you already had</li>
              <li>• You want less clutter, not more apps</li>
              <li>• You like things simple and quiet</li>
              <li>• You don&apos;t want another account to manage</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              If you want automation, syncing, or clever tricks — this isn&apos;t that. This is Base Camp.
            </p>
          </section>

          <section className="rounded-2xl border border-input bg-white/60 p-6">
            <h2 className="text-xl font-serif font-bold mb-3">Your kitchen stays yours</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your list is stored locally on your device. Nothing is uploaded. Nothing is tracked.
              Nothing is shared.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              If you clear your browser, the list clears too — just like a notebook.
            </p>
          </section>

          <section className="rounded-2xl border border-input bg-white/60 p-6">
            <p className="text-lg leading-relaxed">
              <span className="font-serif font-bold">Grandma didn&apos;t need an app.</span>{" "}
              She needed a list.
            </p>
            <div className="mt-4">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/inventory">Open My Kitchen</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Base Camp #1 — simple on purpose.</p>
          </section>
        </div>
      </section>
    </div>
  );
}
