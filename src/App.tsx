import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Kitchen from "./pages/Kitchen";
import KitchenInventory from "./pages/KitchenInventory";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/kitchen" element={<Kitchen />} />
      <Route path="/inventory" element={<KitchenInventory />} />
    </Routes>
  );
}
