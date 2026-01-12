import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="py-10">
      <Helmet>
        <title>What Can I Cook Tonight? | Grandma&apos;s Kitchen</title>
        <meta
          name="description"
          content="Add what you have in your cupboards, fridge, and freezer. Grandma helps you decide what to cook tonight."
        />
        <link rel="canonical" href="https://grandmaskitchen.org/" />
      </Helmet>

      <img
        src="/hero-kitchen.jpg"
        alt="Grandma cooking in a warm kitchen"
        className="w-full max-h-[420px] object-cover rounded-2xl mb-10"
      />

      <section className="py-4 sm:py-8">
        <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight leading-tight">
          What do I cook tonight?
        </h1>

        <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Add what’s in your cupboards, fridge, and freezer. Grandma helps you turn it into a proper meal.
        </p>

        <div className="mt-8">
          <Link to="/kitchen">
            <Button size="lg" className="rounded-full px-8 py-6">
              Start with my kitchen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-10 max-w-2xl">
          <h2 className="text-2xl font-serif font-bold mb-4">
            Why use Grandma&apos;s Kitchen?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Grandma&apos;s Kitchen helps you make the most of what you have on hand. No more last-minute
            grocery runs or wasted ingredients. Just simple, delicious meals made from what you already own.
          </p>
        </div>
      </section>
    </div>
  );
}
