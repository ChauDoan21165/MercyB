import fs from "fs";

const files = [
  "src/lib/tierValidation.ts",
  "src/security/typeGuards.ts",
  "src/lib/wordColorHighlighter.tsx",
  "src/pages/LoginPage.tsx",
  "src/pages/TierDetail.tsx",
];

function read(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
}
function write(p, s) {
  fs.writeFileSync(p, s, "utf8");
}
function backup(p, s) {
  const bak = p + ".BAK.HOTSPOTS";
  if (!fs.existsSync(bak)) fs.writeFileSync(bak, s, "utf8");
}

for (const f of files) {
  const src = read(f);
  if (src == null) continue;
  backup(f, src);
  let out = src;

  // 1) vip3ii -> vip3 (string literals and object keys)
  out = out.replace(/\bvip3ii\b/g, "vip3");

  // 2) JSX namespace errors in wordColorHighlighter.tsx:
  //    JSX.Element[] -> React.ReactElement[]
  if (f.endsWith("wordColorHighlighter.tsx")) {
    out = out.replace(/\bJSX\.Element\[\]/g, "React.ReactElement[]");

    // Ensure React type import exists (minimal)
    if (!out.includes('import React') && !out.includes('from "react"')) {
      out = `import React from "react";\n` + out;
    }
  }

  // 3) Supabase OTP option rename: redirectTo -> emailRedirectTo
  //    (Only change the exact "options: { redirectTo:" pattern)
  if (f.endsWith("LoginPage.tsx")) {
    out = out.replace(
      /options:\s*\{\s*redirectTo\s*:\s*([A-Za-z0-9_$.()]+)\s*\}/g,
      "options: { emailRedirectTo: $1 }"
    );
  }

  // 4) TierDetail: missing unknown key in Record<RoomArea, number>
  if (f.endsWith("TierDetail.tsx")) {
    // Example shown: { core: 0, kids: 0, english: 0, life: 0 }
    out = out.replace(
      /const\s+out:\s*Record<RoomArea,\s*number>\s*=\s*\{\s*core:\s*0,\s*kids:\s*0,\s*english:\s*0,\s*life:\s*0\s*\};/g,
      "const out: Record<RoomArea, number> = { core: 0, kids: 0, english: 0, life: 0, unknown: 0 };"
    );
  }

  if (out !== src) write(f, out);
}

console.log("[fix-typecheck-hotspots] done. Backups: *.BAK.HOTSPOTS");
