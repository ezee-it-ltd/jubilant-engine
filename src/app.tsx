import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Kitchen from "./pages/Kitchen";
import Result from "./pages/Result";

export default function App() {
  return (
    <div className="gmk-page">
      <header className="gmk-header">
        <Link to="/" className="gmk-brand">
          Grandma’s Kitchen
        </Link>
      </header>

      <main className="gmk-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/kitchen" element={<Kitchen />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </main>
    </div>
  );
}
