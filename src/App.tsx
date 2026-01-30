import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Notebook from "@/pages/Notebook";
import ShoppingList from "@/pages/ShoppingList";
import PrintNotebook from "@/pages/PrintNotebook";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/notebook" element={<Notebook />} />
      <Route path="/shopping-list" element={<ShoppingList />} />
      <Route path="/print" element={<PrintNotebook />} />
    </Routes>
  );
}
