import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home"; 
import Kitchen from "./pages/Kitchen";
import Result from "./pages/Result";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="max-w-6xl mx-auto px-6 sm:px-8 py-6">
        <Link
          to="/"
          className="text-sm font-semibold text-emerald-900 hover:underline"
        >
          Grandma’s Kitchen
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 sm:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kitchen" element={<Kitchen />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </main>
    </div>
  )
}
