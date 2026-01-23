import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Kitchen from "./pages/Kitchen";
import KitchenInventory from "./pages/KitchenInventory";
import Login from "./pages/Login";
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
  <Route path="/inventory" element={<KitchenInventory />} />
  <Route path="/login" element={<Login />} />
  <Route path="/result" element={<Result />} />
</Routes>
      </main>
    </div>
  );
}
