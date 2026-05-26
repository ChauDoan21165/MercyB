import { execSync } from "node:child_process";

function run(cmd) {
  console.log("\n—", cmd);
  execSync(cmd, { stdio: "inherit" });
}

run("node -v");
run("npm -v");
run("npm run typecheck");
run("npm run lint");
run("npm run validate-room");
run("npm run build");
console.log("\n✅ DOCTOR PASS: build + types + lint + rooms ok");
