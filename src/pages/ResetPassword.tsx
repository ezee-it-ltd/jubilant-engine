import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function updatePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    if (password.trim().length < 8) {
      setMsg("Please use at least 8 characters.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: password.trim() });

    if (error) {
      setMsg(`Password update failed: ${error.message}`);
      setLoading(false);
      return;
    }

    setMsg("Password updated ✅ You can now sign in.");
    setLoading(false);

    // Optional: send them back to login after a short moment
    setTimeout(() => navigate("/login"), 800);
  }

  return (
    <div className="min-h-screen bg-[#fffaf3]">
      <Helmet>
        <title>Reset Password | Grandma&apos;s Kitchen</title>
      </Helmet>

      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-border bg-[#fffdf9]">
        <Link to="/">
          <h1 className="text-2xl font-bold" style={{ color: "#4b6043" }}>
            Grandma&apos;s Kitchen
          </h1>
        </Link>

        <nav className="flex gap-6">
          <Link to="/" className="font-semibold hover:text-[#c97a40] transition-colors" style={{ color: "#4b6043" }}>
            Home
          </Link>
          <Link to="/recipes" className="font-semibold hover:text-[#c97a40] transition-colors" style={{ color: "#4b6043" }}>
            Recipes
          </Link>
          <Link to="/shop" className="font-semibold hover:text-[#c97a40] transition-colors" style={{ color: "#4b6043" }}>
            Shop
          </Link>
          <Link to="/about" className="font-semibold hover:text-[#c97a40] transition-colors" style={{ color: "#4b6043" }}>
            About
          </Link>
        </nav>
      </header>

      {/* Main Content with Notebook Background */}
      <main
        className="py-8 px-6"
        style={{
          background: "repeating-linear-gradient(to bottom, #fffdf9, #fffdf9 28px, #fff8ed 29px)",
          borderLeft: "6px solid #e6c89a",
        }}
      >
        <section
          className="panel max-w-[820px] mx-auto p-8"
          style={{
            background: "#fffdf9",
            border: "1px solid #e9ddcc",
            borderRadius: "14px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.03)",
          }}
        >
          <span
            className="handwritten block mb-4 text-2xl"
            style={{
              fontFamily: "'Homemade Apple', cursive",
              color: "#c97a40",
            }}
          >
            Account Help
          </span>

          <h2 className="text-3xl font-bold mb-4" style={{ color: "#4b6043", marginTop: ".2rem" }}>
            Set a New Password
          </h2>

          <p className="text-lg leading-relaxed mb-6" style={{ color: "#3a3124" }}>
            Choose a new password for your Grandma&apos;s Kitchen account.
            Once updated, you can sign in and your inventory will save properly.
          </p>

          {/* Reset Panel */}
          <div
            className="panel p-6 mb-6"
            style={{
              background: "#fffefb",
              border: "1px solid #e9ddcc",
              borderRadius: "14px",
            }}
          >
            <h3 className="text-xl font-bold mb-4" style={{ color: "#4b6043", marginTop: 0 }}>
              New password
            </h3>

            {msg && (
              <div className="mb-4 p-3 rounded-xl border border-input bg-white/60" style={{ color: "#3a3124" }}>
                {msg}
              </div>
            )}

            <form onSubmit={updatePassword}>
              <label className="block mb-2 font-semibold" style={{ color: "#3a3124" }}>
                Password (8+ characters)
              </label>

              <input
                type="password"
                required
                placeholder="Enter a new password"
                className="w-full max-w-[420px] p-3 border rounded-lg mb-3"
                style={{
                  borderColor: "#decbb0",
                  borderRadius: "8px",
                }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />

              <div className="flex gap-3 items-center">
                <Button
                  type="submit"
                  disabled={loading}
                  className="font-semibold px-6 py-3 rounded-lg transition-all hover:translate-y-[-2px]"
                  style={{
                    background: "#c97a40",
                    color: "#fff",
                  }}
                >
                  {loading ? "Updating..." : "Update Password"}
                </Button>

                <Link to="/login" className="font-semibold underline" style={{ color: "#4b6043" }}>
                  Back to login
                </Link>
              </div>

              <p className="text-sm mt-3" style={{ color: "#6b5b46" }}>
                If this page says it can’t update your password, your reset link may have expired — request a new one from{" "}
                <Link to="/login" className="underline">
                  Login
                </Link>
                .
              </p>
            </form>
          </div>

          {/* Quote */}
          <blockquote
            className="panel p-6"
            style={{
              background: "#fffdf9",
              border: "1px solid #e9ddcc",
              borderRadius: "14px",
              fontStyle: "italic",
            }}
          >
            <p className="text-lg mb-2" style={{ color: "#3a3124" }}>
              “A good system is one that tells you the truth — then helps you fix it.”
            </p>
            <footer
              style={{
                fontFamily: "'Homemade Apple', cursive",
                color: "#c97a40",
                fontStyle: "normal",
              }}
            >
              — Grandma
            </footer>
          </blockquote>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm" style={{ color: "#856a4a" }}>
        © 2025 Grandma&apos;s Kitchen — All Rights Reserved
      </footer>
    </div>
  );
};

export default ResetPassword;
