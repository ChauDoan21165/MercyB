#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

const repoRoot = process.cwd();
const defaultTimeoutMs = 90_000;
const commonAmbientIncludes = ["src/vite-env.d.ts", "src/types/**/*.d.ts"];

const shardDefinitions = {
  languages: ["src/languages/**/*.ts", "src/languages/**/*.tsx"],
  "languages-punjabi": [
    "src/languages/punjabi/**/*.ts",
    "src/languages/punjabi/**/*.tsx",
  ],
  "languages-thai": [
    "src/languages/thai/**/*.ts",
    "src/languages/thai/**/*.tsx",
  ],
  lib: ["src/lib/**/*.ts", "src/lib/**/*.tsx"],
  components: ["src/components/**/*.ts", "src/components/**/*.tsx"],
  "components-room": [
    "src/components/room/**/*.ts",
    "src/components/room/**/*.tsx",
    "src/components/RoomHeaderStandard.tsx",
    "src/components/RoomLoadShell.tsx",
    "src/components/RoomProgress.tsx",
    "src/components/RoomSearch.tsx",
    "src/components/TierRoomColumns.tsx",
    "src/components/VirtualizedRoomGrid.tsx",
  ],
  "components-room-renderer": ["src/components/room/RoomRenderer.tsx"],
  "components-root": ["src/components/*.ts", "src/components/*.tsx"],
  "components-root-room-nav": [
    "src/components/EnhancedRoomCard.tsx",
    "src/components/GlobalAppBar.tsx",
    "src/components/GlobalHomeButton.tsx",
    "src/components/GlobalNavigationBox.tsx",
    "src/components/HomeButton.tsx",
    "src/components/NavLink.tsx",
    "src/components/PremiumRoomCard.tsx",
    "src/components/ResponsiveRoomGrid.tsx",
    "src/components/RoomCardSkeleton.tsx",
    "src/components/RoomDisclaimer.tsx",
    "src/components/RoomErrorState.tsx",
    "src/components/RoomHeader.tsx",
    "src/components/RoomHeaderStandard.tsx",
    "src/components/RoomLoadShell.tsx",
    "src/components/RoomProgress.tsx",
    "src/components/RoomSearch.tsx",
    "src/components/TierRoomColumns.tsx",
    "src/components/VirtualizedRoomGrid.tsx",
  ],
  "components-root-misc": [
    "src/components/AudioPlayer.tsx",
    "src/components/BackButton.tsx",
    "src/components/Bilingual.tsx",
    "src/components/Breadcrumb.tsx",
    "src/components/ChatMessage.tsx",
    "src/components/ColorModeToggle.tsx",
    "src/components/ConsentModal.tsx",
    "src/components/CornerTalker.tsx",
    "src/components/DemoFeatureBlocker.tsx",
    "src/components/DemoModeBanner.tsx",
    "src/components/DesignAuditReport.tsx",
    "src/components/EnglishRoadmapPanel.tsx",
    "src/components/ErrorBoundary.tsx",
    "src/components/FeedbackBar.tsx",
    "src/components/FeedbackNotificationBadge.tsx",
    "src/components/GiftCodeModal.tsx",
    "src/components/GlobalPlayingIndicator.tsx",
    "src/components/HeroBand.tsx",
    "src/components/HighlightedContent.tsx",
    "src/components/LanguageSwitcher.tsx",
    "src/components/LayoutShell.tsx",
    "src/components/LessonUiLangToggle.tsx",
    "src/components/LoadingSkeleton.tsx",
    "src/components/MatchmakingButton.tsx",
    "src/components/MercyBladeThemeToggle.tsx",
    "src/components/MercyChat.tsx",
    "src/components/MercyGuide.tsx",
    "src/components/MercyGuideProfileSettings.tsx",
    "src/components/MercyGuideSettings.tsx",
    "src/components/MessageActions.tsx",
    "src/components/MoodCheck.tsx",
    "src/components/NotificationBootstrap.tsx",
    "src/components/PageTransition.tsx",
    "src/components/PairedHighlightedContent.tsx",
    "src/components/PointsDisplay.tsx",
    "src/components/PricingToggle.tsx",
    "src/components/ProfileAvatarUpload.tsx",
    "src/components/ProfilePrivacySettings.tsx",
    "src/components/PromoCodeBanner.tsx",
    "src/components/ProtectedContent.tsx",
    "src/components/SecurityAlertSettings.tsx",
    "src/components/SmoothScrollContainer.tsx",
    "src/components/StrictProtectedContent.tsx",
    "src/components/ThemeSwitchTransition.tsx",
    "src/components/ThemeToggle.tsx",
    "src/components/TrialExpiredScreen.tsx",
    "src/components/TruncatedTitle.tsx",
    "src/components/UnauthenticatedBanner.tsx",
    "src/components/UpdatePrompt.tsx",
    "src/components/ZoomControl.tsx",
  ],
  "components-ui": ["src/components/ui/**/*.ts", "src/components/ui/**/*.tsx"],
  "components-mercy": [
    "src/components/mercy/**/*.ts",
    "src/components/mercy/**/*.tsx",
    "src/components/mercy-guide/**/*.ts",
    "src/components/mercy-guide/**/*.tsx",
  ],
  "components-ai-tutor": [
    "src/components/ai-tutor/**/*.ts",
    "src/components/ai-tutor/**/*.tsx",
  ],
  "components-admin": [
    "src/components/admin/**/*.ts",
    "src/components/admin/**/*.tsx",
  ],
  "components-home-auth": [
    "src/components/home/**/*.ts",
    "src/components/home/**/*.tsx",
    "src/components/auth/**/*.ts",
    "src/components/auth/**/*.tsx",
  ],
  "components-learning": [
    "src/components/audio/**/*.ts",
    "src/components/audio/**/*.tsx",
    "src/components/languages/**/*.ts",
    "src/components/languages/**/*.tsx",
    "src/components/pronunciation/**/*.ts",
    "src/components/pronunciation/**/*.tsx",
    "src/components/speech/**/*.ts",
    "src/components/speech/**/*.tsx",
    "src/components/writing/**/*.ts",
    "src/components/writing/**/*.tsx",
  ],
  "components-commerce-account": [
    "src/components/account/**/*.ts",
    "src/components/account/**/*.tsx",
    "src/components/billing/**/*.ts",
    "src/components/billing/**/*.tsx",
    "src/components/certificates/**/*.ts",
    "src/components/certificates/**/*.tsx",
    "src/components/entitlements/**/*.ts",
    "src/components/entitlements/**/*.tsx",
    "src/components/family/**/*.ts",
    "src/components/family/**/*.tsx",
    "src/components/gift/**/*.ts",
    "src/components/gift/**/*.tsx",
    "src/components/iap/**/*.ts",
    "src/components/iap/**/*.tsx",
    "src/components/parent-view/**/*.ts",
    "src/components/parent-view/**/*.tsx",
    "src/components/payment/**/*.ts",
    "src/components/payment/**/*.tsx",
    "src/components/pricing/**/*.ts",
    "src/components/pricing/**/*.tsx",
  ],
  "components-community-growth": [
    "src/components/analytics/**/*.ts",
    "src/components/analytics/**/*.tsx",
    "src/components/community/**/*.ts",
    "src/components/community/**/*.tsx",
    "src/components/companion/**/*.ts",
    "src/components/companion/**/*.tsx",
    "src/components/contribute/**/*.ts",
    "src/components/contribute/**/*.tsx",
    "src/components/corporate/**/*.ts",
    "src/components/corporate/**/*.tsx",
    "src/components/feedback/**/*.ts",
    "src/components/feedback/**/*.tsx",
    "src/components/groups/**/*.ts",
    "src/components/groups/**/*.tsx",
    "src/components/leaderboard/**/*.ts",
    "src/components/leaderboard/**/*.tsx",
    "src/components/referral/**/*.ts",
    "src/components/referral/**/*.tsx",
    "src/components/share/**/*.ts",
    "src/components/share/**/*.tsx",
    "src/components/streak/**/*.ts",
    "src/components/streak/**/*.tsx",
    "src/components/xp/**/*.ts",
    "src/components/xp/**/*.tsx",
  ],
  "components-operational": [
    "src/components/a11y/**/*.ts",
    "src/components/a11y/**/*.tsx",
    "src/components/design-system/**/*.ts",
    "src/components/design-system/**/*.tsx",
    "src/components/dev/**/*.ts",
    "src/components/dev/**/*.tsx",
    "src/components/layout/**/*.ts",
    "src/components/layout/**/*.tsx",
    "src/components/monitoring/**/*.ts",
    "src/components/monitoring/**/*.tsx",
    "src/components/native/**/*.ts",
    "src/components/native/**/*.tsx",
    "src/components/offline/**/*.ts",
    "src/components/offline/**/*.tsx",
    "src/components/perf/**/*.ts",
    "src/components/perf/**/*.tsx",
    "src/components/performance/**/*.ts",
    "src/components/performance/**/*.tsx",
    "src/components/roadmap/**/*.ts",
    "src/components/roadmap/**/*.tsx",
    "src/components/security/**/*.ts",
    "src/components/security/**/*.tsx",
    "src/components/seo/**/*.ts",
    "src/components/seo/**/*.tsx",
    "src/components/stage-3a/**/*.ts",
    "src/components/stage-3a/**/*.tsx",
    "src/components/stage-3b/**/*.ts",
    "src/components/stage-3b/**/*.tsx",
    "src/components/stage-4/**/*.ts",
    "src/components/stage-4/**/*.tsx",
    "src/components/support/**/*.ts",
    "src/components/support/**/*.tsx",
    "src/components/teacher-portal/**/*.ts",
    "src/components/teacher-portal/**/*.tsx",
    "src/components/theme/**/*.ts",
    "src/components/theme/**/*.tsx",
    "src/components/tiers/**/*.ts",
    "src/components/tiers/**/*.tsx",
  ],
  "components-placement-exam": [
    "src/components/exam-prep/**/*.ts",
    "src/components/exam-prep/**/*.tsx",
    "src/components/placement/**/*.ts",
    "src/components/placement/**/*.tsx",
  ],
  "components-teacher-mercy-int": [
    "src/components/teacher-mercy/**/*.ts",
    "src/components/teacher-mercy/**/*.tsx",
    "src/lib/tm-int/**/*.ts",
    "src/lib/tm-int/**/*.tsx",
  ],
  "components-major-product": [
    "src/components/*.ts",
    "src/components/*.tsx",
    "src/components/ai-tutor/**/*.ts",
    "src/components/ai-tutor/**/*.tsx",
    "src/components/mercy/**/*.ts",
    "src/components/mercy/**/*.tsx",
    "src/components/mercy-guide/**/*.ts",
    "src/components/mercy-guide/**/*.tsx",
    "src/components/room/**/*.ts",
    "src/components/room/**/*.tsx",
    "src/components/ui/**/*.ts",
    "src/components/ui/**/*.tsx",
  ],
  "pages-features-hooks": [
    "src/pages/**/*.ts",
    "src/pages/**/*.tsx",
    "src/features/**/*.ts",
    "src/features/**/*.tsx",
    "src/hooks/**/*.ts",
    "src/hooks/**/*.tsx",
  ],
  "no-languages": [
    "src/billing/**/*.ts",
    "src/billing/**/*.tsx",
    "src/components/**/*.ts",
    "src/components/**/*.tsx",
    "src/config/**/*.ts",
    "src/config/**/*.tsx",
    "src/contexts/**/*.ts",
    "src/contexts/**/*.tsx",
    "src/core/**/*.ts",
    "src/core/**/*.tsx",
    "src/data/**/*.ts",
    "src/data/**/*.tsx",
    "src/design-system/**/*.ts",
    "src/design-system/**/*.tsx",
    "src/features/**/*.ts",
    "src/features/**/*.tsx",
    "src/hooks/**/*.ts",
    "src/hooks/**/*.tsx",
    "src/lib/**/*.ts",
    "src/lib/**/*.tsx",
    "src/layouts/**/*.ts",
    "src/layouts/**/*.tsx",
    "src/mercy/**/*.ts",
    "src/mercy/**/*.tsx",
    "src/middleware/**/*.ts",
    "src/middleware/**/*.tsx",
    "src/notificationEngine/**/*.ts",
    "src/notificationEngine/**/*.tsx",
    "src/pages/**/*.ts",
    "src/pages/**/*.tsx",
    "src/pages-functions/**/*.ts",
    "src/pages-functions/**/*.tsx",
    "src/providers/**/*.ts",
    "src/providers/**/*.tsx",
    "src/router/**/*.ts",
    "src/router/**/*.tsx",
    "src/security/**/*.ts",
    "src/security/**/*.tsx",
    "src/services/**/*.ts",
    "src/services/**/*.tsx",
    "src/speech/**/*.ts",
    "src/speech/**/*.tsx",
    "src/stage-3b/**/*.ts",
    "src/stage-3b/**/*.tsx",
    "src/store/**/*.ts",
    "src/store/**/*.tsx",
    "src/styles/**/*.ts",
    "src/styles/**/*.tsx",
    "src/types/**/*.ts",
    "src/types/**/*.tsx",
    "src/utils/**/*.ts",
    "src/utils/**/*.tsx",
  ],
};

function parseArgs(argv) {
  const args = {
    list: false,
    timeoutMs: defaultTimeoutMs,
    shards: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--list") {
      args.list = true;
      continue;
    }
    if (arg === "--timeout-ms") {
      const raw = argv[index + 1];
      index += 1;
      const parsed = Number(raw);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new Error(`Invalid --timeout-ms value: ${raw}`);
      }
      args.timeoutMs = parsed;
      continue;
    }
    args.shards.push(arg);
  }

  return args;
}

function writeShardConfig(tempDir, shardName, includes) {
  const configPath = path.join(tempDir, `tsconfig.${shardName}.json`);
  const relativeIncludes = [...commonAmbientIncludes, ...includes].map((include) =>
    path.relative(tempDir, path.join(repoRoot, include)),
  );
  const config = {
    extends: path.relative(tempDir, path.join(repoRoot, "tsconfig.typecheck.json")),
    include: relativeIncludes,
  };
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
  return configPath;
}

function tail(text, maxLines = 80) {
  const lines = text.trimEnd().split("\n");
  return lines.slice(Math.max(0, lines.length - maxLines)).join("\n");
}

function runShard(shardName, timeoutMs, tempDir) {
  const includes = shardDefinitions[shardName];
  if (!includes) {
    throw new Error(`Unknown shard: ${shardName}`);
  }

  const configPath = writeShardConfig(tempDir, shardName, includes);
  const startedAt = Date.now();
  const result = spawnSync(
    path.join(repoRoot, "node_modules/.bin/tsc"),
    ["-p", configPath, "--noEmit", "--extendedDiagnostics"],
    {
      cwd: repoRoot,
      encoding: "utf8",
      timeout: timeoutMs,
      maxBuffer: 16 * 1024 * 1024,
    },
  );
  const elapsedMs = Date.now() - startedAt;

  const status = result.error?.code === "ETIMEDOUT"
    ? "timeout"
    : result.status === 0
      ? "pass"
      : "fail";

  return {
    shardName,
    status,
    exitCode: result.status,
    signal: result.signal,
    elapsedMs,
    stdout: tail(result.stdout || ""),
    stderr: tail(result.stderr || ""),
  };
}

function printResult(result) {
  console.log(`\n### ${result.shardName}`);
  console.log(`status=${result.status}`);
  console.log(`exitCode=${result.exitCode ?? ""}`);
  console.log(`signal=${result.signal ?? ""}`);
  console.log(`elapsedMs=${result.elapsedMs}`);
  if (result.stdout) {
    console.log("\nstdout_tail:");
    console.log(result.stdout);
  }
  if (result.stderr) {
    console.log("\nstderr_tail:");
    console.log(result.stderr);
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const shardNames = Object.keys(shardDefinitions);

  if (args.list) {
    console.log(shardNames.join("\n"));
    return;
  }

  const selectedShards = args.shards.length > 0 ? args.shards : shardNames;
  const tempDir = fs.mkdtempSync(path.join(repoRoot, ".typecheck-shards-"));

  try {
    for (const shardName of selectedShards) {
      printResult(runShard(shardName, args.timeoutMs, tempDir));
    }
  } finally {
    fs.rmSync(tempDir, { force: true, recursive: true });
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
