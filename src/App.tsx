import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Notebook from "@/pages/Notebook";
// import other pages...

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/notebook" element={<Notebook />} />
      {/* other routes... */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
