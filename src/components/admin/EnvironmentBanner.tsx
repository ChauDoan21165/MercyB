import { Badge } from "@/components/ui/badge";

const MODE = import.meta.env.VITE_MB_VALIDATION_MODE || "strict";

export default function EnvironmentBanner() {
  const color =
    MODE === "strict" ? "bg-red-600" :
    MODE === "preview" ? "bg-blue-600" :
    "bg-orange-600";

  const label =
    MODE === "strict" ? "STRICT VALIDATION (PRODUCTION)" :
    MODE === "preview" ? "PREVIEW VALIDATION (STAGING)" :
    "WIP VALIDATION (LOCAL DEV)";

  return (
    <div className={`w-full py-2 text-white text-center font-semibold ${color}`}>
      {label}
    </div>
  );
}
