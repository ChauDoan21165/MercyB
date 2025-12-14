// src/App.tsx — v2025-12-14-04-DIAG
import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";

export default function App() {
  useEffect(() => {
    console.log("DIAG App mounted");
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>DIAG MODE</h1>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}
