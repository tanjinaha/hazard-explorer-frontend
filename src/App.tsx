import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import Farer from "./pages/Farer";
import FareDetalj from "./pages/FareDetalj";
import Info from "./pages/Info";
import Snoskred from "./pages/Snoskred";
import Flom from "./pages/Flom";
import Jordskred from "./pages/Jordskred";
import Kvikleireskred from "./pages/Kvikleireskred";
import RegionDetail from "./pages/RegionDetail";
import Ressurser from "./pages/Ressurser";
import TestAvalanche from "@/pages/TestAvalanche";
//

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
          <NavLink to="/kvikleireskred" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>Kvikleireskred</NavLink>
          <NavLink to="/ressurser" className={({ isActive }) => `${link} ${isActive ? active : ""}`}>
            Ressurser
          </NavLink>
        </nav>
      </header>

      <main className="p-0">
        <Routes>
          <Route path="/" element={<Navigate to="/farer" replace />} />
          <Route path="/farer" element={<Farer />} />
          <Route path="/farer/:id" element={<FareDetalj />} />
          <Route path="/info" element={<Info />} />
          <Route path="/snoskred" element={<Snoskred />} />
          <Route path="/snoskred/region/:id" element={<RegionDetail />} />
          <Route path="/flom" element={<Flom />} />
          <Route path="/jordskred" element={<Jordskred />} />
          <Route path="/kvikleireskred" element={<Kvikleireskred />} />
          <Route path="*" element={<div>Ikke funnet (Not found)</div>} />
          <Route path="/ressurser" element={<Ressurser />} />
          <Route path="/test-avalanche" element={<TestAvalanche />} />


        </Routes>
      </main>
    </div>
  );
}
