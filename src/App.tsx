import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Notebook from "./pages/Notebook";
import ShoppingList from "./pages/ShoppingList";
import PrintNotebook from "./pages/PrintNotebook";
import PrintShoppingList from "./pages/PrintShoppingList";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/notebook" element={<Notebook />} />
      <Route path="/shopping-list" element={<ShoppingList />} />
      <Route path="/print-shopping-list" element={<PrintShoppingList />} />
      <Route path="/print/:scope?" element={<PrintNotebook />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
