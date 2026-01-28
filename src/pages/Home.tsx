import PageShell from "@/components/PageShell";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";

type StoryBeat = {
  img: string;
  alt: string;
  caption: string;
};

const STORY: StoryBeat[] = [
  {
    img: "/story/weve-all-been-here.png",
    alt: "A messy fridge and food waste showing the problem of forgetting what we already have",
    caption:
      "We don’t waste food because we’re careless. We waste it because we forget what we already have.",
  },
  {
    img: "/story/aha-moment.png",
    alt: "A calm kitchen scene with a notebook and tea, suggesting a simple list and a quiet moment",
    caption: "A quiet moment before you shop — write it down once, then trust your list.",
  },
  {
    img: "/story/grandma-as-the-guide.png",
    alt: "Grandma sitting at the table with a notebook titled Cupboards, Fridge, Freezer",
    caption: "“Let’s keep it simple, love. Cupboards. Fridge. Freezer.”",
  },
  {
    img: "/story/fairy-tale-ending.png",
    alt: "Neat cupboards, fridge, and freezer with clear labels and dates, showing the organised result",
    caption: "Neat shelves. Clear dates. No duplicates. That’s the happy ending.",
  },
];

function StoryFigure({ beat }: { beat: StoryBeat }) {
  return (
    <figure className="gmk-panel gmk-story">
      <img className="gmk-story-img" src={beat.img} alt={beat.alt} loading="lazy" />
      <figcaption className="gmk-story-cap">{beat.caption}</figcaption>
    </figure>
  );
}

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

      <div id="top" className="py-10">
        {/* HERO */}
        <div className="gmk-hero">
          <img src="/hero-kitchen.jpg" alt="Grandma cooking in a warm kitchen" loading="eager" />
        </div>

        <h1 className="gmk-h1">What&apos;s already in your kitchen?</h1>

        <p className="gmk-lead gmk-dropcap">
          Stop buying what you already have. Keep a simple list of what&apos;s in your cupboards,
          fridge, and freezer — written once, trusted everywhere.
        </p>

        {/* ONE clear notebook panel */}
        <section className="gmk-panel gmk-notebook-actions">
          <h2 className="gmk-h2">Your Notebook</h2>

          <ul className="gmk-notebook-steps">
            <li>
              <strong>Read</strong>
              <span>Check what you already have before you shop</span>
            </li>
            <li>
              <strong>Edit</strong>
              <span>Add or remove items in seconds</span>
            </li>
            <li>
              <strong>Print</strong>
              <span>Keep a clean copy in the kitchen</span>
            </li>
          </ul>

          <div className="gmk-notebook-cta-wrap">
            <Link to="/inventory" className="gmk-candy-btn">
              Open my notebook ✨
            </Link>
          </div>

          <div className="gmk-notebook-links">
            <Button asChild className="rounded-full px-6">
              <Link to="/inventory">Read your notebook</Link>
            </Button>

            <Button asChild variant="outline" className="rounded-full px-6">
              <Link to="/inventory">Edit your notebook</Link>
            </Button>

            <Button asChild variant="outline" className="rounded-full px-6">
              <Link to="/print/all">Print your notebook</Link>
            </Button>
          </div>
        </section>

        <p className="text-sm text-muted-foreground mt-3">
          No login. No account. Nothing shared.
        </p>

        <hr className="gmk-rule" />

        <StoryFigure beat={STORY[0]} />
        <hr className="gmk-rule" />

        <section className="gmk-panel">
          <h2 className="gmk-h2">Why Grandma&apos;s Kitchen?</h2>
          <p className="text-muted-foreground leading-relaxed">
            This solves one huge problem: you go to the shops — but you don’t actually know what you
            already have.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Grandma’s Kitchen is Base Camp #1: simple on purpose. A calm list you trust.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            No scanning. No upsells. No nonsense. Just fewer duplicates and less waste.
          </p>
        </section>

        <hr className="gmk-rule" />
        <StoryFigure beat={STORY[1]} />
        <hr className="gmk-rule" />

        <section className="gmk-panel">
          <h2 className="gmk-h2">How it works</h2>
          <ul className="gmk-how">
            <li>
              <span className="gmk-how-icon">🧺</span>
              <span>Choose a section: Cupboards / Fridge / Freezer</span>
            </li>
            <li>
              <span className="gmk-how-icon">✍️</span>
              <span>Add what you’ve already got (rough lists are fine)</span>
            </li>
            <li>
              <span className="gmk-how-icon">✅</span>
              <span>Check it before you shop — stop duplicates</span>
            </li>
          </ul>
        </section>

        <hr className="gmk-rule" />
        <StoryFigure beat={STORY[2]} />
        <hr className="gmk-rule" />

        <section className="gmk-panel">
          <h2 className="gmk-h2">Your kitchen stays yours</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your notebook is private. Available on your devices. Never sold, tracked, or shared.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-3">
            Clear it if you wish — just like a real notebook.
          </p>
        </section>

        <hr className="gmk-rule" />
        <StoryFigure beat={STORY[3]} />
        <hr className="gmk-rule" />

        <section className="gmk-panel gmk-close">
          <div className="gmk-notebook-cta">
            <img
              src="/images/grandmas-shopping-list.png"
              alt="Grandma writing a shopping list with a feather pen"
              className="gmk-notebook-img"
              loading="lazy"
            />
            <div className="gmk-notebook-text">
              <p className="gmk-notebook-title">Print your notebook now!</p>
              <p className="gmk-notebook-sub">
                A clean copy of everything you have — cupboards, fridge, freezer.
              </p>
              <Link to="/print/all" className="gmk-notebook-link">
                ✒️ Print the full notebook
              </Link>
              <a href="#top" className="gmk-backtotop">
                ↑ Back to top
              </a>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Base Camp #1 — simple on purpose.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
