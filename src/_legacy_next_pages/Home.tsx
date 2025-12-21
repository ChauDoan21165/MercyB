// src/pages/Home.tsx — v2025-12-14-BASELINE
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    console.log("Home.tsx version: v2025-12-14-BASELINE");
    (window as any).__MB_HOME_VERSION__ = "v2025-12-14-BASELINE";
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Mercy Blade — HOME OK</h1>
      <p>If you see this, React + routing are stable.</p>
      <p style={{ opacity: 0.6, fontSize: 12 }}>
        Home v2025-12-14-BASELINE
      </p>
    </main>
  );
}
