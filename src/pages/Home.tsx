import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { OrganizationSchema } from '@/components/StructuredData';
import { ArrowRight, UtensilsCrossed, Sparkles, Heart, Leaf, BookOpen, ShoppingCart, Users, FileText } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Grandma's Kitchen | Simple Family Cooking</title>
        <meta
          name="description"
          content="Grandma's Kitchen helps families cook simple, budget-friendly meals using what they already have. Less waste, less stress, more time together."
        />
        <link rel="canonical" href="https://grandmaskitchen.org/" />
      </Helmet>

      <OrganizationSchema />

      <main id="main" role="main">
        {/* Section 1: Hero */}
        <section
          className="relative"
          aria-label="Welcome to Grandma's Kitchen"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50/60 via-orange-50/30 to-transparent pointer-events-none" />
          <div className="relative max-w-3xl mx-auto px-6 sm:px-8 pt-16 pb-20 md:pt-24 md:pb-28 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-5 md:mb-6 leading-tight tracking-tight">
              Your kitchen companion for simple, waste-free family cooking.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed">
              Grandma's Kitchen helps you cook with what you already have, save
              money on groceries, and take the stress out of
              {" "}“what's for dinner tonight?”
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                asChild
                className="rounded-full px-8 py-6 text-base font-medium shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto"
              >
                <Link to="/auth?mode=signup">
                  Join Grandma's Kitchen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-full px-8 py-6 text-base font-medium w-full sm:w-auto"
              >
                <Link to="/auth">Login</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Section 2: What GK Helps With */}
        <section className="bg-white/50 border-y border-amber-100/50">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 md:py-24">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-12 md:mb-16 text-center">
              What Grandma's Kitchen helps with
            </h2>

            <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-amber-100/80 flex items-center justify-center">
                    <UtensilsCrossed className="h-6 w-6 text-amber-700" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">
                  Cook with what you have
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get meal ideas based on ingredients already in your kitchen.
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-amber-100/80 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-amber-700" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">
                  Simple, budget-friendly meals
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Family recipes that don't need fancy ingredients or hours of
                  prep.
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-amber-100/80 flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-amber-700" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">
                  Reduce food waste
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Use up what you have before it goes off. Less waste, more
                  savings.
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-amber-100/80 flex items-center justify-center">
                    <Heart className="h-6 w-6 text-amber-700" />
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-lg">
                  Less dinner-time stress
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  No more staring at the fridge wondering what to make.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: What Members Get */}
        <section className="py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-6 sm:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
                What you get as a Grandma's Kitchen member
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to make everyday cooking simpler, cheaper, and calmer.
              </p>
            </div>

            <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 mb-12">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-amber-100/80 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-amber-700" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1 text-lg">
                    Simple, family-friendly recipes
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Cook real meals with ingredients you already have.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-amber-100/80 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-amber-700" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1 text-lg">
                    Smart kitchen & shopping tools
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Plan meals, reduce waste, and avoid buying what you don't need.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-amber-100/80 flex items-center justify-center">
                    <Users className="h-5 w-5 text-amber-700" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1 text-lg">
                    Family & kids-friendly content
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Recipes and ideas everyone can enjoy.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-amber-100/80 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-amber-700" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1 text-lg">
                    Printable guides & kitchen helpers
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Meal planners, recipe cards, and time-saving printables.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                asChild
                className="rounded-full px-8 py-6 text-base font-medium shadow-md hover:shadow-lg transition-shadow"
              >
                <Link to="/auth?mode=signup">
                  Join Grandma's Kitchen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Section 4: Tone & Trust */}
        <section className="bg-white/50 border-y border-amber-100/50 py-16 md:py-24">
          <div className="max-w-2xl mx-auto px-6 sm:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-6">
              Old-school common sense for modern families
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed mb-5">
              Grandma's Kitchen is built on the simple wisdom that's been passed
              down through generations: use what you have, don't let good food
              go to waste, and keep meals simple enough that anyone can make
              them.
            </p>

            <p className="text-muted-foreground leading-relaxed">
              No fads. No guilt. No complicated meal plans or expensive
              ingredients. Just practical help for real families who want to eat
              well without the stress.
            </p>
          </div>
        </section>

        {/* Section 5: Final CTA */}
        <section className="bg-gradient-to-b from-amber-50/40 to-amber-50/60 border-t border-amber-100/50">
          <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16 md:py-24 text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
              Ready to make dinnertime easier?
            </h2>

            <p className="text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
              Join thousands of families who've brought a little calm back to
              their kitchens.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                asChild
                className="rounded-full px-8 py-6 text-base font-medium shadow-md hover:shadow-lg transition-shadow w-full sm:w-auto"
              >
                <Link to="/auth?mode=signup">
                  Join Grandma's Kitchen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="ghost"
                asChild
                className="rounded-full px-6 py-6 text-base w-full sm:w-auto"
              >
                <Link to="/auth">Already a member? Login</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
