import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="py-10">
      <Helmet>
        <title>No Login Needed | Grandma&apos;s Kitchen</title>
        <meta
          name="description"
          content="Base Camp #1 does not require an account. Your inventory is saved privately on this device."
        />
        <link rel="canonical" href="https://grandmaskitchen.org/login" />
      </Helmet>

      <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-4">
        No login needed
      </h1>

      <p className="text-muted-foreground mb-6 max-w-xl leading-relaxed">
        Base Camp #1 is designed to be simple. Your kitchen inventory is saved{" "}
        <strong>privately on this device</strong>, so you can start instantly.
      </p>

      <div className="rounded-2xl border border-input bg-white/60 p-5 max-w-xl mb-6">
        <p className="text-sm text-muted-foreground">
          Later, we can add accounts to sync across devices — but we’re shipping a
          clean, reliable Base Camp first.
        </p>
      </div>

      <div className="flex gap-2 flex-wrap max-w-xl">
        <Button className="rounded-xl" onClick={() => navigate("/inventory")}>
          Go to Inventory
        </Button>

        <Button className="rounded-xl" variant="outline" onClick={() => navigate("/")}>
          Back to Home
        </Button>

        <Button className="rounded-xl" variant="secondary" asChild>
          <Link to="/kitchen">What can I cook tonight?</Link>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mt-6 max-w-xl">
        Tip: If you clear your browser data, you’ll clear this device’s saved inventory.
        Use the Inventory page “Export” button to back up your list.
      </p>
    </div>
  );
}
