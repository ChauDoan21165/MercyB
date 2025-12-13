// src/pages/Home.tsx — v2025-12-14-02
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Home.tsx version: v2025-12-14-02");
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-xl p-8 rounded-2xl border bg-white shadow-sm text-center space-y-4">
        <h1 className="text-3xl font-bold">Mercy Blade</h1>
        <p className="text-gray-600">
          Home page placeholder (safe). We’ll re-enable the full homepage after the app is stable.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Button onClick={() => navigate("/free")} className="gap-2">
            Go to Free Rooms <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-xs text-gray-400">Home.tsx v2025-12-14-02</p>
      </div>
    </main>
  );
}
