import { Link } from "react-router-dom";

export default function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="gmk-page">
      <header className="gmk-header">
        <Link to="/" className="gmk-brand" aria-label="Grandma's Kitchen Home">
          Grandma&apos;s Kitchen
        </Link>
      </header>

      <main className="gmk-container">{children}</main>

      <footer className="gmk-container" style={{ paddingTop: 24, paddingBottom: 24 }}>
        <div className="text-xs opacity-60">
          Build: {import.meta.env.VITE_BUILD_ID ?? "no-build-id"}
        </div>
      </footer>
    </div>
  );
}
