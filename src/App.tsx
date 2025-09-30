import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import Farer from "./pages/Farer";
import FareDetalj from "./pages/FareDetalj";
import Info from "./pages/Info";
import Snøskred from "./pages/Snøskred";
import Flom from "./pages/Flom";
import Jordskred from "./pages/Jordskred";
import Kvikleire from "./pages/Kvikleire";

export default function App() {
  const link = "px-3 py-2 rounded hover:bg-slate-100 transition";
  const active = "bg-slate-200";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <nav className="container mx-auto flex items-center gap-2 p-3">
          <NavLink to="/farer" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>Farer</NavLink>
          <NavLink to="/info" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>Info</NavLink>
          <NavLink to="/snoskred" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>Snøskred</NavLink>
          <NavLink to="/flom" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>Flom</NavLink>
          <NavLink to="/jordskred" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>Jordskred</NavLink>
          <NavLink to="/kvikleire" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>Kvikleire</NavLink>
        </nav>
      </header>

      <main className="p-0">
        <Routes>
          <Route path="/" element={<Navigate to="/farer" replace />} />
          <Route path="/farer" element={<Farer />} />
          <Route path="/farer/:id" element={<FareDetalj />} />
          <Route path="/info" element={<Info />} />
          <Route path="/snoskred" element={<Snøskred />} />
          <Route path="/flom" element={<Flom />} />
          <Route path="/jordskred" element={<Jordskred />} />
          <Route path="/kvikleire" element={<Kvikleire />} />
          <Route path="*" element={<div>Ikke funnet (Not found)</div>} />
        </Routes>
      </main>
    </div>
  );
}
