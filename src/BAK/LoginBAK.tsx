import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // Check login state on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setLoggedIn(!!data.session?.user);
    });
  }, []);

  async function signIn() {
    setLoading(true);
    setMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      const m = error.message.toLowerCase();

      if (m.includes("invalid login credentials")) {
        setMsg("Email or password is incorrect.");
      } else if (m.includes("email not confirmed")) {
        setMsg("Please confirm your email first. Check inbox or junk.");
      } else {
        setMsg(error.message);
      }

      setLoading(false);
      return;
    }

    setMsg("Signed in successfully.");
    setLoggedIn(true);
    setLoading(false);
    navigate("/inventory");
  }

  async function signUp() {
    setLoading(true);
    setMsg(null);

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });

    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }

    setMsg("Account created. Check your email to confirm, then sign in.");
    setLoading(false);
  }

  async function resetPassword() {
    setLoading(true);
    setMsg(null);

    const e = email.trim();
    if (!e) {
      setMsg("Enter your email first, then click Reset password.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(e, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }

    setMsg("Password reset email sent. Check inbox or junk.");
    setLoading(false);
  }

  async function signOut() {
    setLoading(true);
    await supabase.auth.signOut();
    setLoggedIn(false);
    setMsg("Signed out.");
    setLoading(false);
  }

  return (
    <div className="py-10">
      <Helmet>
        <title>Login | Grandma&apos;s Kitchen</title>
      </Helmet>

      <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-4">
        Account Login
      </h1>

      <p className="text-muted-foreground mb-8 max-w-xl">
        An account keeps your kitchen inventory private and securely saved.
      </p>

      {msg && (
        <div className="mb-4 p-3 rounded-xl border border-input bg-white/60">
          {msg}
        </div>
      )}

      {/* LOGGED IN STATE */}
      {loggedIn ? (
        <div className="space-y-4 max-w-md">
          <Button
            className="rounded-xl w-full"
            onClick={() => navigate("/inventory")}
          >
            Go to your inventory
          </Button>

          <Button
            className="rounded-xl w-full"
            variant="outline"
            onClick={signOut}
            disabled={loading}
          >
            Sign out
          </Button>
        </div>
      ) : (
        /* LOGGED OUT STATE */
        <div className="space-y-4 max-w-md">
          <input
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />

          <input
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <div className="flex gap-2 flex-wrap">
            <Button className="rounded-xl" onClick={signIn} disabled={loading}>
              Sign in
            </Button>

            <Button
              className="rounded-xl"
              variant="secondary"
              onClick={signUp}
              disabled={loading}
            >
              Sign up
            </Button>

            <Button
              className="rounded-xl"
              variant="outline"
              onClick={resetPassword}
              disabled={loading}
            >
              Reset password
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Tip: Use an email you can access — password resets are sent by email.
          </p>
        </div>
      )}
    </div>
  );
}
