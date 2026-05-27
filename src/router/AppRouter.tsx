/**
 * Path: src/router/AppRouter.tsx
 * File: AppRouter.tsx
 */

import React, { Suspense, useEffect, useRef } from "react";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import {
  isPlacementEntryRouteAvailable,
  isPlacementV3RouteAvailable,
} from "@/lib/placement/availability";
import { AnonymousOnboardingGate } from "@/router/AnonymousOnboardingGate";
import {
  Routes,
  Route,
  Navigate,
  useParams,
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import AdminRoute from "@/components/admin/AdminRoute";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAuth } from "@/providers/AuthProvider";
import { useUserAccess } from "@/hooks/useUserAccess";
import TrialExpiredScreen from "@/components/TrialExpiredScreen";
import ChatSupportButton from "@/components/support/ChatSupportButton";
import { FeedbackBar } from "@/components/FeedbackBar";
import { CertificateToast } from "@/components/certificates/CertificateToast";
import { LevelUpModal } from "@/components/xp/LevelUpModal";
import LessonUiLangToggle, {
  useLessonUiLang,
} from "@/components/LessonUiLangToggle";
// 2FA Phase 1 — route guard that forces aal=2 when the user has a
// verified MFA factor. Pairs with the RLS gate from migration
// 20260524 so neither layer is the only line of defense.
import RequireAal2 from "@/components/auth/RequireAal2";
import { WebOnlyRoute } from "@/router/WebOnlyRoute";

const MB_ROUTER_VERSION = "2026-04-11-app-router-room-alias-hardening";

const ChatHub             = lazyWithRetry(() => import("@/pages/ChatHub"));
const AllRooms            = lazyWithRetry(() => import("@/pages/AllRooms"));
const Home                = lazyWithRetry(() => import("@/pages/Home"));
const MarketingLandingPage = lazyWithRetry(() => import("@/pages/MarketingLandingPage"));
const Privacy             = lazyWithRetry(() => import("@/pages/Privacy"));
const Terms                = lazyWithRetry(() => import("@/pages/Terms"));
const ContentAdvisory      = lazyWithRetry(() => import("@/pages/legal/ContentAdvisory"));
const Support             = lazyWithRetry(() => import("@/pages/Support"));
const AccountPage         = lazyWithRetry(() => import("@/pages/AccountPage"));
const XPHistoryPage       = lazyWithRetry(() => import("@/pages/xp/XPHistoryPage"));
// A3 — Progress Certificates (gated by `certificates_enabled` flag).
const MilestoneObserver   = lazyWithRetry(() =>
  import("@/components/certificates/MilestoneObserver").then((m) => ({ default: m.MilestoneObserver })),
);
const CertificatesGalleryPage = lazyWithRetry(() => import("@/pages/certificates/CertificatesGalleryPage"));
const PushPreferencesPage = lazyWithRetry(() => import("@/pages/account/PushPreferences"));
const ReferralPage        = lazyWithRetry(() => import("@/pages/Referral"));
const BillingPage         = lazyWithRetry(() => import("@/pages/Billing"));
const BillingSuccessPage  = lazyWithRetry(() => import("@/pages/BillingSuccessPage"));
const CertVerifyPage      = lazyWithRetry(() => import("@/pages/CertVerifyPage"));
const Pricing             = lazyWithRetry(() => import("../screens/Pricing"));
const TierIndex           = lazyWithRetry(() => import("@/pages/TierIndex"));
const TierDetail          = lazyWithRetry(() => import("@/pages/TierDetail"));
const LoginPage           = lazyWithRetry(() => import("@/pages/LoginPage"));
const ResetPasswordPage   = lazyWithRetry(() => import("@/pages/ResetPasswordPage"));
const ConvertAccountPage  = lazyWithRetry(() => import("@/pages/auth/ConvertAccount"));
const AcceptInvitePage    = lazyWithRetry(() => import("@/pages/auth/AcceptInvite"));
const OnboardingPage      = lazyWithRetry(() => import("@/pages/onboarding/OnboardingPage"));
const BulkInvitePage      = lazyWithRetry(() => import("@/pages/referral/BulkInvite"));

// Email preferences — public /unsubscribe (token-based) + auth-required
// /account/notifications.
const UnsubscribePage             = lazyWithRetry(() => import("@/pages/Unsubscribe"));
const NotificationPreferencesPage = lazyWithRetry(() => import("@/pages/account/NotificationPreferences"));

// Placement v2 (PR 11, final of the 11-PR series): one self-contained
// adaptive page (hook → flow → edge fn → engine). The v1 page files
// (WelcomePage/WhoForPage/TestPage/ResultsPage) are left byte-for-byte
// intact on disk (#658 "HIDE not delete") but are no longer routed —
// the v2 session is a single server-driven loop, not the v1 4-page
// wizard (reconstruction flag F1; wireframes doc ephemeral).
const PlacementV3WelcomePage = lazyWithRetry(() => import("@/pages/placement/v3/WelcomePage"));
const PlacementV3WhoForPage  = lazyWithRetry(() => import("@/pages/placement/v3/WhoForPage"));
const PlacementV3TestPage    = lazyWithRetry(() => import("@/pages/placement/v3/TestPage"));
const PlacementV3ResultsPage = lazyWithRetry(() => import("@/pages/placement/v3/ResultsPage"));
const PlacementV3ResumePage  = lazyWithRetry(() => import("@/pages/placement/v3/ResumePage"));
const PlacementV3SkipConfirmPage = lazyWithRetry(() => import("@/pages/placement/v3/SkipConfirmPage"));
// Eager (not lazy) — the shell is a 30-line observer-only wrapper
// with no dependencies worth code-splitting, and it must be on hand
// to instrument every placement page's mount.
import PlacementRouteShell from "@/pages/placement/v3/PlacementRouteShell";

const SpeechDrillPage      = lazyWithRetry(() => import("@/pages/SpeechDrillPage"));
const PhonemeDrillPage     = lazyWithRetry(() => import("@/pages/practice/PhonemeDrillPage"));
const PronunciationSRSSessionPage = lazyWithRetry(() => import("@/pages/PronunciationSRSSessionPage"));
const VocabularyLibraryPage = lazyWithRetry(() => import("@/pages/vocabulary/Library"));
const VocabularyReviewPage = lazyWithRetry(() => import("@/pages/vocabulary/ReviewSession"));
const SpeechHistoryPage    = lazyWithRetry(() => import("@/pages/speech/SpeechHistoryPage"));
const DailyChallengePage   = lazyWithRetry(() => import("@/pages/challenges/DailyChallengePage"));
const ChallengeHistoryPage = lazyWithRetry(() => import("@/pages/challenges/ChallengeHistoryPage"));
const ProgressPage         = lazyWithRetry(() => import("@/pages/Progress"));
const WeakAtPage           = lazyWithRetry(() => import("@/pages/WeakAt"));
const ListeningLibraryPage = lazyWithRetry(() => import("@/pages/listening/Library"));
const ListeningClipPage    = lazyWithRetry(() => import("@/pages/listening/ClipPlayer"));
const LeaderboardPage      = lazyWithRetry(() => import("@/pages/LeaderboardPage"));
const MonthlyReferralLeaderboard = lazyWithRetry(() => import("@/pages/leaderboards/MonthlyReferralLeaderboard"));
const ProfessionsIndexPage = lazyWithRetry(() => import("@/pages/professions/ProfessionsIndexPage"));
const NailTechLessonsPage  = lazyWithRetry(() => import("@/pages/professions/NailTechLessonsPage"));
const RestaurantLessonsPage = lazyWithRetry(() => import("@/pages/professions/RestaurantLessonsPage"));
const CustomerServiceLessonsPage = lazyWithRetry(() => import("@/pages/professions/CustomerServiceLessonsPage"));
const TechWorkerLessonsPage = lazyWithRetry(() => import("@/pages/professions/TechWorkerLessonsPage"));
const HealthcareLessonsPage = lazyWithRetry(() => import("@/pages/professions/HealthcareLessonsPage"));
const DriversLessonsPage = lazyWithRetry(() => import("@/pages/professions/DriversLessonsPage"));
const HospitalityLessonsPage = lazyWithRetry(() => import("@/pages/professions/HospitalityLessonsPage"));

// Language learning verticals
const LanguagesIndexPage   = lazyWithRetry(() => import("@/pages/languages/LanguagesIndexPage"));
const FrenchLessonsPage    = lazyWithRetry(() => import("@/pages/languages/FrenchLessonsPage"));
const GermanLessonsPage    = lazyWithRetry(() => import("@/pages/languages/GermanLessonsPage"));
const JapaneseLessonsPage  = lazyWithRetry(() => import("@/pages/languages/JapaneseLessonsPage"));
const ChineseLessonsPage   = lazyWithRetry(() => import("@/pages/languages/ChineseLessonsPage"));
const KoreanLessonsPage    = lazyWithRetry(() => import("@/pages/languages/KoreanLessonsPage"));
const VietnameseLessonsPage = lazyWithRetry(() => import("@/pages/languages/VietnameseLessonsPage"));
const SpanishLessonsPage    = lazyWithRetry(() => import("@/pages/languages/SpanishLessonsPage"));
const ViKidsEnglishTutorPage = lazyWithRetry(() => import("@/pages/kids/ViKidsEnglishTutorPage"));

// Mercy v2 — multi-turn conversation thread page (auth-required).
const MercyThreadPage      = lazyWithRetry(() => import("@/pages/mercy/MercyThreadPage"));

// Mercy unified chat — single-pane chat that replaces the multi-tab
// drawer for users on the new default ('unified'). Legacy MercyGuide
// drawer is preserved on Home for the 'classic' opt-out.
const MercyUnifiedPage     = lazyWithRetry(() => import("@/pages/mercy/MercyUnifiedPage"));

const WritingFeedbackPage  = lazyWithRetry(() => import("@/pages/writing/WritingFeedbackPage"));
const WritingPracticePage  = lazyWithRetry(() => import("@/pages/writing/WritingPracticePage"));
const WritingPracticeSessionPage = lazyWithRetry(() => import("@/pages/writing/WritingPracticeSessionPage"));

const RoleplayPage = lazyWithRetry(() => import("@/pages/RoleplayPage"));

// IELTS prep mode (Step 11 — premium-gated; gate enforced per-page).
const IELTSIndexPage      = lazyWithRetry(() => import("@/pages/exam-prep/IELTSIndexPage"));
const IELTSWritingPage    = lazyWithRetry(() => import("@/pages/exam-prep/IELTSWritingPage"));
const IELTSSpeakingPage   = lazyWithRetry(() => import("@/pages/exam-prep/IELTSSpeakingPage"));
const IELTSListeningPage  = lazyWithRetry(() => import("@/pages/exam-prep/IELTSListeningPage"));
const IELTSReadingPage    = lazyWithRetry(() => import("@/pages/exam-prep/IELTSReadingPage"));
const IELTSEstimatorPage  = lazyWithRetry(() => import("@/pages/exam-prep/IELTSEstimatorPage"));
const VSTEPSpeakingPage   = lazyWithRetry(() => import("@/pages/exam-prep/VSTEPSpeakingPage"));
const VSTEPIndexPage     = lazyWithRetry(() => import("@/pages/exam-prep/VSTEPIndexPage"));
const VSTEPListeningPage = lazyWithRetry(() => import("@/pages/exam-prep/VSTEPListeningPage"));
const VSTEPReadingPage   = lazyWithRetry(() => import("@/pages/exam-prep/VSTEPReadingPage"));
const VSTEPWritingPage   = lazyWithRetry(() => import("@/pages/exam-prep/VSTEPWritingPage"));

// SEO landing pages — Vietnamese-keyword targeted, public, no auth required.
const SeoHocTiengAnhChoNguoiVietPage = lazyWithRetry(() => import("@/pages/seo/HocTiengAnhChoNguoiVietPage"));
const SeoSuaPhatAmTiengAnhPage       = lazyWithRetry(() => import("@/pages/seo/SuaPhatAmTiengAnhPage"));
const SeoLoiTiengAnhNguoiVietPage    = lazyWithRetry(() => import("@/pages/seo/LoiTiengAnhNguoiVietHaySaiPage"));
const SeoPhongVanTiengAnhPage        = lazyWithRetry(() => import("@/pages/seo/PhongVanTiengAnhPage"));
const SeoHocTiengAnhMienPhiPage      = lazyWithRetry(() => import("@/pages/seo/HocTiengAnhMienPhiPage"));

// Per-topic SEO landing pages — Vietnamese-keyword targeted, public.
// Each one is a self-contained route loaded on demand so the 60+ topic
// surface stays out of the main bundle.
const VstepTopicPage                 = lazyWithRetry(() => import("@/pages/seo/VstepTopicPage"));
const ToeicTopicPage                 = lazyWithRetry(() => import("@/pages/seo/ToeicTopicPage"));
const IeltsTopicPage                 = lazyWithRetry(() => import("@/pages/seo/IeltsTopicPage"));

// Developer portal — Step 11 public API.
const DeveloperPortalPage = lazyWithRetry(() => import("@/pages/dev/DeveloperPortalPage"));

// 2FA Phase 1 — paid-tier gated, both routes RequireAuth-wrapped.
const SecuritySettingsPage = lazyWithRetry(() => import("@/pages/account/SecuritySettings"));
const Enable2FAPage = lazyWithRetry(() => import("@/pages/auth/Enable2FA"));
const Aal2ChallengePage = lazyWithRetry(() => import("@/pages/auth/Aal2Challenge"));
// 2FA Phase 2 — recovery flow (lost phone). Public route; password
// is verified before the backup-code is checked.
const RecoverWith2FAPage = lazyWithRetry(() => import("@/pages/auth/RecoverWith2FA"));

const BlogIndex = lazyWithRetry(() => import("@/pages/blog/BlogIndex"));
const BlogPost  = lazyWithRetry(() => import("@/pages/blog/BlogPost"));
const WeeklyDigest = lazyWithRetry(() => import("@/pages/blog/WeeklyDigest"));


const PublicProfilePage   = lazyWithRetry(() => import("@/pages/profile/PublicProfilePage"));
const ShareProgressPage   = lazyWithRetry(() => import("@/pages/profile/ShareProgressPage"));

const PurchaseGiftPage    = lazyWithRetry(() => import("@/pages/gift/PurchaseGiftPage"));
const RedeemGiftPage      = lazyWithRetry(() => import("@/pages/gift/RedeemGiftPage"));
const MyGiftsPage         = lazyWithRetry(() => import("@/pages/gift/MyGiftsPage"));

const VNCulturalIndexPage = lazyWithRetry(() => import("@/pages/cultural-packs/VNCulturalIndexPage"));
const VNCulturalPackPage  = lazyWithRetry(() => import("@/pages/cultural-packs/VNCulturalPackPage"));

const GroupsIndex          = lazyWithRetry(() => import("@/pages/groups/GroupsIndex"));
const GroupPage            = lazyWithRetry(() => import("@/pages/groups/GroupPage"));
const CreateGroupPage      = lazyWithRetry(() => import("@/pages/groups/CreateGroupPage"));

const PublicRoadmapPage    = lazyWithRetry(() => import("@/pages/roadmap/PublicRoadmapPage"));
const FeedbackTriagePage   = lazyWithRetry(() => import("@/pages/admin/FeedbackTriagePage"));

const InterviewIndex         = lazyWithRetry(() => import("@/pages/interview/InterviewIndex"));
const InterviewSessionPage   = lazyWithRetry(() => import("@/pages/interview/InterviewSessionPage"));
const MockInterviewIndex     = lazyWithRetry(() => import("@/pages/mock-interview/MockInterviewIndex"));
const MockInterviewRoom      = lazyWithRetry(() => import("@/pages/mock-interview/MockInterviewRoom"));
const InterviewSummaryPage   = lazyWithRetry(() => import("@/pages/interview/InterviewSummaryPage"));

const NailTechnicianPage     = lazyWithRetry(() => import("@/pages/profession-packs/NailTechnicianPage"));

const ContributeSentencePage = lazyWithRetry(() => import("@/pages/contribute/ContributeSentencePage"));
const MySubmissionsPage      = lazyWithRetry(() => import("@/pages/contribute/MySubmissionsPage"));
const PendingSentencesPage   = lazyWithRetry(() => import("@/pages/admin/PendingSentencesPage"));

// User testimonial pages — public stories index + auth-required share
// flow + admin moderation queue. See migration
// 20260426000000_user_stories.sql for the schema and RLS.
const StoriesPage            = lazyWithRetry(() => import("@/pages/Stories"));
const ShareStoryPage         = lazyWithRetry(() => import("@/pages/stories/ShareStory"));
const StoryDetailPage        = lazyWithRetry(() => import("@/pages/stories/StoryDetail"));
const StoryModerationPage    = lazyWithRetry(() => import("@/pages/admin/StoryModeration"));

// Teacher review portal (A11) — admin level 5+ reviewer queue +
// admin level 9+ triage of teacher feedback. Schema:
// supabase/migrations/20260533000000_teacher_feedback.sql.
const TeacherReviewQueuePage    = lazyWithRetry(() => import("@/pages/teacher-portal/ReviewQueue"));
const TeacherReviewItemPage     = lazyWithRetry(() => import("@/pages/teacher-portal/ReviewItem"));
const TeacherFeedbackTriagePage = lazyWithRetry(() => import("@/pages/admin/TeacherFeedbackTriage"));
const TeacherRoute              = lazyWithRetry(() => import("@/components/teacher-portal/TeacherRoute"));

// Community-curated mock-interview prompts. See migration
// 20260534000000_user_interview_prompts.sql for the schema and RLS.
const SubmitInterviewPromptPage  = lazyWithRetry(() => import("@/pages/interview-prompts/Submit"));
const CommunityPromptsPage       = lazyWithRetry(() => import("@/pages/mock-interview/CommunityPrompts"));
const InterviewPromptsModerationPage = lazyWithRetry(() => import("@/pages/admin/InterviewPromptsModeration"));

const FamilyPlanPage         = lazyWithRetry(() => import("@/pages/family/FamilyPlanPage"));

const TOEICIndexPage         = lazyWithRetry(() => import("@/pages/exam-prep/TOEICIndexPage"));
const TOEICPracticePage      = lazyWithRetry(() => import("@/pages/exam-prep/TOEICPracticePage"));
const TOEICEstimatorPage     = lazyWithRetry(() => import("@/pages/exam-prep/TOEICEstimatorPage"));

// TOEFL iBT prep (Step 11 — premium gate is in-page, auth-required).
const TOEFLIndexPage         = lazyWithRetry(() => import("@/pages/exam-prep/TOEFLIndexPage"));
const TOEFLReadingPage       = lazyWithRetry(() => import("@/pages/exam-prep/TOEFLReadingPage"));
const TOEFLListeningPage     = lazyWithRetry(() => import("@/pages/exam-prep/TOEFLListeningPage"));
const TOEFLWritingPage       = lazyWithRetry(() => import("@/pages/exam-prep/TOEFLWritingPage"));
const TOEFLSpeakingPage      = lazyWithRetry(() => import("@/pages/exam-prep/TOEFLSpeakingPage"));
const TOEFLEstimatorPage     = lazyWithRetry(() => import("@/pages/exam-prep/TOEFLEstimatorPage"));
const TOEFLReadingContentPage     = lazyWithRetry(() => import("@/pages/exam-prep/toefl/Reading"));
const TOEFLReadingPassagePage     = lazyWithRetry(() => import("@/pages/exam-prep/toefl/ReadingPassage"));
const TOEFLListeningContentPage   = lazyWithRetry(() => import("@/pages/exam-prep/toefl/Listening"));
const TOEFLListeningItemPage      = lazyWithRetry(() => import("@/pages/exam-prep/toefl/ListeningItem"));
const TOEFLWritingContentPage     = lazyWithRetry(() => import("@/pages/exam-prep/toefl/Writing"));
const TOEFLWritingTopicPage       = lazyWithRetry(() => import("@/pages/exam-prep/toefl/WritingTopic"));
const TOEFLSpeakingContentPage    = lazyWithRetry(() => import("@/pages/exam-prep/toefl/Speaking"));
const TOEFLSpeakingTopicPage      = lazyWithRetry(() => import("@/pages/exam-prep/toefl/SpeakingTopic"));
const TOEICPracticePackPage  = lazyWithRetry(() => import("@/pages/exam-prep/toeic/Practice"));
const IELTSSpeakingContentPage      = lazyWithRetry(() => import("@/pages/exam-prep/ielts/Speaking"));
const IELTSSpeakingTopicPage        = lazyWithRetry(() => import("@/pages/exam-prep/ielts/SpeakingTopic"));
const IELTSListeningContentPage     = lazyWithRetry(() => import("@/pages/exam-prep/ielts/Listening"));
const IELTSReadingContentPage     = lazyWithRetry(() => import("@/pages/exam-prep/ielts/Reading"));
const IELTSReadingPassagePage     = lazyWithRetry(() => import("@/pages/exam-prep/ielts/ReadingPassage"));
const IELTSWritingContentPage     = lazyWithRetry(() => import("@/pages/exam-prep/ielts/Writing"));
const IELTSWritingTopicPage       = lazyWithRetry(() => import("@/pages/exam-prep/ielts/WritingTopic"));
const IELTSListeningItemPage        = lazyWithRetry(() => import("@/pages/exam-prep/ielts/ListeningItem"));

const CorporateDashboardPage = lazyWithRetry(() => import("@/pages/corporate/CorporateDashboardPage"));
const CreateCorporatePage    = lazyWithRetry(() => import("@/pages/corporate/CreateCorporatePage"));
const JoinCorporatePage      = lazyWithRetry(() => import("@/pages/corporate/JoinCorporatePage"));

const AdminDashboard          = lazyWithRetry(() => import("@/pages/admin/AdminDashboard"));
const AdminUsersPage          = lazyWithRetry(() => import("@/pages/admin/AdminUsersPage"));
const AdminPaymentsPage       = lazyWithRetry(() => import("@/pages/admin/AdminPaymentsPage"));
const AdminAccessCodes        = lazyWithRetry(() => import("@/pages/admin/AdminAccessCodes"));
const AudioCoveragePage       = lazyWithRetry(() => import("@/pages/admin/AudioCoveragePage"));
const AdminFeedbackPage       = lazyWithRetry(() => import("@/pages/admin/AdminFeedbackPage"));
const AdminSubscriptions      = lazyWithRetry(() => import("@/pages/admin/AdminSubscriptions"));
const FeatureFlagsAdmin       = lazyWithRetry(() => import("@/pages/admin/FeatureFlagsAdmin"));
const AdminAnalyticsPage      = lazyWithRetry(() => import("@/pages/admin/AdminAnalyticsPage"));
const LatencyMonitoring       = lazyWithRetry(() => import("@/pages/admin/LatencyMonitoring"));
const SloDashboard            = lazyWithRetry(() => import("@/pages/admin/SloDashboard"));
const SloDetail               = lazyWithRetry(() => import("@/pages/admin/SloDetail"));
const PlacementForensicsDashboard = lazyWithRetry(() => import("@/pages/admin/PlacementForensicsDashboard"));
const CostMonitoring          = lazyWithRetry(() => import("@/pages/admin/CostMonitoring"));
const FrontendPerformance     = lazyWithRetry(() => import("@/pages/admin/FrontendPerformance"));
const RetentionDashboard      = lazyWithRetry(() => import("@/pages/admin/RetentionDashboard"));
const BehavioralAnalytics     = lazyWithRetry(() => import("@/pages/admin/BehavioralAnalytics"));
const RoomLoadDiagnostics     = lazyWithRetry(() =>
  import("@/components/admin/RoomLoadDiagnostics").then((m) => ({
    default: m.RoomLoadDiagnostics,
  })),
);

// Dev-only: useAudioUrl manual test harness. Gated behind import.meta.env.DEV
// so Vite tree-shakes both the dynamic import and the route JSX in prod builds.
const DevAudioTest = import.meta.env.DEV
  ? lazyWithRetry(() => import("@/pages/DevAudioTest"))
  : null;

// Opt-in production probe — Sentry sourcemap symbolication smoke test.
// Inert by default: the page renders a "disabled" notice unless BOTH
// `VITE_SENTRY_SMOKE_TEST_ENABLED=true` is set in the build env AND the
// visitor passes `?confirm=throw` on the URL. Kept on main so each
// release has a one-click way to verify Sentry receives a symbolicated
// frame pointing back to src/pages/SentrySmokeTest.tsx (rather than a
// minified vendor stack). Safe to leave in place — no analytics, no
// network calls until the explicit confirm.
const SentrySmokeTest = lazyWithRetry(() => import("@/pages/SentrySmokeTest"));
const AiTutorPage = lazyWithRetry(() => import("@/pages/AiTutor"));

declare global {
  interface Window { MB_ROUTER_VERSION?: string; }
}

// ── Guards ────────────────────────────────────────────────────────────────────

/**
 * Redirect unauthenticated users to /signin with a `returnTo=` param
 * so they return to the intended page after signing in.
 * Shows nothing while auth is still loading.
 */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Cache the last RESOLVED auth state. Without this, a brief
  // isLoading flip during a Supabase token refresh (which fires on tab
  // focus via the auth client's internal visibility handler) would
  // unmount the entire protected subtree, throw away local component
  // state (e.g. open modals), and force a full re-fetch storm on the
  // way back. With the cache, loading flips are non-disruptive: we
  // keep showing the previously-resolved view until the refresh
  // settles, and only swap if the resolved value actually changed.
  const hasResolvedRef = useRef(false);
  const lastUserRef = useRef<typeof user>(null);
  if (!isLoading) {
    hasResolvedRef.current = true;
    lastUserRef.current = user;
  }

  // First boot, never resolved — render nothing to avoid a flash.
  if (!hasResolvedRef.current) return null;

  const effectiveUser = isLoading ? lastUserRef.current : user;

  if (!effectiveUser) {
    const next = encodeURIComponent(
      `${location.pathname}${location.search}${location.hash}`,
    );
    return <Navigate to={`/signin?returnTo=${next}`} replace />;
  }

  return <>{children}</>;
}

/**
 * Room-level auth gate. Kids rooms stay login-free per CLAUDE.md #2
 * ("Kids mode is sacred. No login friction."). All other rooms require
 * sign-in. Kids pattern match mirrors src/pages/TierIndex.tsx.
 */
function RequireAuthForRoom({ children }: { children: React.ReactNode }) {
  const { roomId } = useParams<{ roomId: string }>();
  const id = roomId ?? "";
  const isKidsRoom =
    id.includes("_kids_l1") || id.includes("_kids_l2") || id.includes("_kids_l3");

  if (isKidsRoom) return <>{children}</>;
  return <RequireAuth>{children}</RequireAuth>;
}

/**
 * Trial-expiry gate. Renders the TrialExpiredScreen for free-tier users
 * whose 3-day trial has ended. Premium users and grandfathered users
 * (profiles.created_at before the cutoff in me-entitlement) pass through.
 * Kids rooms skip this layer entirely via RequireAuthForRoom.
 */
function RequireTrialActive({ children }: { children: React.ReactNode }) {
  const { isTrialExpired, isLoading } = useUserAccess();

  // Same caching pattern as RequireAuth — useUserAccess flips its own
  // isLoading whenever auth flips (see hooks/useUserAccess.ts), so this
  // guard would otherwise also unmount the room subtree on every tab
  // focus / token refresh. Cache the last-resolved expiry state so
  // loading flips don't tear the tree down.
  const hasResolvedRef = useRef(false);
  const lastExpiredRef = useRef(false);
  if (!isLoading) {
    hasResolvedRef.current = true;
    lastExpiredRef.current = isTrialExpired;
  }

  if (!hasResolvedRef.current) return null;

  const effectiveExpired = isLoading ? lastExpiredRef.current : isTrialExpired;
  if (effectiveExpired) return <TrialExpiredScreen />;
  return <>{children}</>;
}

// ── Fallbacks ─────────────────────────────────────────────────────────────────

function NotFound() {
  return (
    <div style={{ padding: 32 }}>
      <h2>404</h2>
      <p>Không tìm thấy trang.</p>
    </div>
  );
}

function RouteFallback() {
  const location = useLocation();
  if (location.pathname.startsWith("/ai-tutor")) {
    return (
      <main
        aria-label="Loading AI Tutor"
        style={{
          minHeight: "calc(100vh - 72px)",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "32px 16px",
          background: "#ffffff",
        }}
      >
        <section
          style={{
            width: "100%",
            maxWidth: 720,
            textAlign: "center",
            border: "1px solid rgba(99, 102, 241, 0.16)",
            borderRadius: 18,
            padding: 20,
            background: "rgba(238, 242, 255, 0.42)",
          }}
        >
          <img
            src="/teacher-mercy.webp"
            alt="Teacher Mercy"
            width={72}
            height={72}
            style={{
              width: 72,
              height: 72,
              borderRadius: 9999,
              objectFit: "cover",
              display: "block",
              margin: "0 auto 12px",
              border: "1px solid rgba(99, 102, 241, 0.18)",
            }}
          />
          <div style={{ fontSize: 18, fontWeight: 950, color: "#0f172a" }}>
            Teacher Mercy AI Tutor
          </div>
          <div style={{ marginTop: 4, fontSize: 13, fontWeight: 700, color: "#64748b" }}>
            Loading tutor tools...
          </div>
        </section>
      </main>
    );
  }
  return <div style={{ padding: 24, opacity: 0.72 }}>Loading…</div>;
}

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}

// ── Redirect helpers ──────────────────────────────────────────────────────────

function RoomRoomRedirect() {
  const { roomId } = useParams<{ roomId: string }>();
  return <Navigate to={roomId ? `/room/${roomId}` : "/rooms"} replace />;
}

function RoomIndexRedirect() {
  return <Navigate to="/rooms" replace />;
}

function RoomsRoomRedirect() {
  const { roomId } = useParams<{ roomId: string }>();
  return <Navigate to={roomId ? `/room/${roomId}` : "/rooms"} replace />;
}

function RoomsDirectRedirect() {
  const { roomId } = useParams<{ roomId: string }>();
  return <Navigate to={roomId ? `/room/${roomId}` : "/rooms"} replace />;
}

function ChatAliasRedirect() {
  const { roomId } = useParams<{ roomId: string }>();
  return <Navigate to={roomId ? `/room/${roomId}` : "/rooms"} replace />;
}

function LoginRedirect()   { return <Navigate to="/signin" replace />; }
function RedeemRedirect()  { return <Navigate to="/account" replace />; }

function AuthRedirect() {
  const location = useLocation();
  const target = `/signin${location.search || ""}${location.hash || ""}`;
  return <Navigate to={target} replace />;
}

function PlacementV3Gate({ children }: { children: React.ReactNode }) {
  if (!isPlacementV3RouteAvailable()) {
    return <Navigate to="/" replace />;
  }
  return <RequireAuth>{children}</RequireAuth>;
}

// ── Shell ─────────────────────────────────────────────────────────────────────

function AppHeroShell() {
  const nav = useNavigate();
  const loc = useLocation();
  const { user, isLoading } = useAuth();
  // Global gloss-language toggle (default "vi"; opt-in "en"). One
  // instance lives here in the chrome band so it persists across every
  // page instead of fragmenting per language page.
  const [uiLang, setUiLang] = useLessonUiLang();

  const pathname    = String(loc.pathname || "");
  const isAdmin     = pathname.startsWith("/admin");
  const userEmail   = String(user?.email ?? "").trim();
  const PAGE_MAX    = 980;
  const FRAME_PAD_X = 16;

  const shell: React.CSSProperties = {
    minHeight: "100vh", width: "100%", position: "relative",
    // No zIndex — removing the stacking-context promotion lets shadcn
    // dialogs/toasts/popovers (z-50, z-100, portaled to body) layer
    // correctly above page content. The sticky band keeps its own
    // zIndex below to protect the navigation strip from page overlays.
    pointerEvents: "auto",
    overflowX: "hidden",
  };

  const band: React.CSSProperties = {
    position: "sticky", top: 0, zIndex: 999999, pointerEvents: "auto",
    background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
  };

  const bandInner: React.CSSProperties = {
    maxWidth: PAGE_MAX, margin: "0 auto",
    padding: `4px ${FRAME_PAD_X}px 2px`,
    display: "grid", gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center", gap: 12,
  };

  const leftNavWrap: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 10,
    justifyContent: "flex-start", flexWrap: "wrap",
  };

  const rightWrap: React.CSSProperties = {
    display: "flex", justifyContent: "flex-end",
    alignItems: "center", gap: 10, flexWrap: "wrap",
  };

  const navBtn: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "8px 14px", borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.90)", color: "rgba(0,0,0,0.78)",
    textDecoration: "none", fontWeight: 900, fontSize: 13,
    lineHeight: 1, cursor: "pointer", pointerEvents: "auto",
  };

  const authStatusPill: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "8px 12px", borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.90)", color: "rgba(0,0,0,0.62)",
    fontWeight: 900, fontSize: 13, lineHeight: 1, pointerEvents: "auto",
  };

  const statusDot: React.CSSProperties = {
    width: 9, height: 9, borderRadius: 9999,
    background: user ? "rgb(16,185,129)" : "rgba(0,0,0,0.30)",
    flex: "0 0 auto",
  };

  const brand: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center",
    justifySelf: "center", lineHeight: 0, textDecoration: "none",
    width: "min(190px, 46vw)", height: 56, minHeight: 56,
    padding: 0, overflow: "hidden",
  };

  const brandImg: React.CSSProperties = {
    display: "block", width: "min(250px, 62vw)", height: 84,
    maxWidth: "none", maxHeight: "none", objectFit: "contain",
    objectPosition: "center", transform: "translateY(-1px) scale(1.62)",
    transformOrigin: "center center", filter: "none",
    userSelect: "none", pointerEvents: "none",
  };

  const onBack = () => {
    try {
      if (typeof window !== "undefined" && window.history?.length <= 1) {
        nav("/");
      } else {
        nav(-1);
      }
    } catch { nav("/"); }
  };

  const contentFrame: React.CSSProperties = {
    maxWidth: PAGE_MAX, margin: "0 auto", width: "100%",
    minWidth: 0, overflowX: "hidden",
  };

  return (
    <div style={shell}>
      {isAdmin ? (
        <Outlet />
      ) : (
        <>
          <div style={band} aria-label="Mercy global hero band">
            <div style={bandInner}>
              <div style={leftNavWrap}>
                {pathname !== "/" && (
                  <Link to="/" style={navBtn} aria-label="Go Home">⌂ Home</Link>
                )}
                <button type="button" style={navBtn} onClick={onBack} aria-label="Go Back">
                  ← Back
                </button>
              </div>

              <Link to="/" style={brand} title="Mercy Blade" aria-label="Mercy Blade">
                {/* LCP element on the global hero band (incl. /onboarding,
                    the anon entry route). Was a 126 KB PNG — the single
                    largest image-delivery LCP cost in the mobile Lighthouse
                    audit. AVIF (~4 KB) → WebP (~7 KB) → PNG fallback chain;
                    intrinsic 512×341 kept (no downscale → pixel-identical,
                    CSS in `brandImg` still controls displayed size).
                    width/height are the intrinsic dims (CLS insurance — the
                    style overrides them for layout); fetchPriority high so
                    the preloader fetches it ahead of non-critical requests. */}
                <picture>
                  <source srcSet="/brand/mercy-blade-header.avif" type="image/avif" />
                  <source srcSet="/brand/mercy-blade-header.webp" type="image/webp" />
                  <img
                    src="/brand/mercy-blade-header.png"
                    alt="Mercy Blade"
                    width={512}
                    height={341}
                    style={brandImg}
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                    draggable={false}
                  />
                </picture>
              </Link>

              <div style={rightWrap}>
                {/* Global VI/EN gloss-language toggle — one control for
                    the whole app, persisted via UiLanguageProvider. */}
                <LessonUiLangToggle value={uiLang} onChange={setUiLang} />
                {isLoading ? (
                  <div style={authStatusPill} aria-live="polite">
                    <span style={statusDot} />
                    <span>Checking...</span>
                  </div>
                ) : user ? (
                  <Link to="/account" style={navBtn} aria-label="Account" title={userEmail || "Account"}>
                    Account
                  </Link>
                ) : (
                  <Link to="/signin" style={navBtn} aria-label="Sign in">Sign in</Link>
                )}
              </div>
            </div>
          </div>

          <div style={contentFrame}>
            <Suspense fallback={<RouteFallback />}>
              <Outlet />
            </Suspense>
          </div>

          {/* Floating multi-channel support (Zalo + Messenger + email).
              Self-suppresses on / and /support; the recording overlay
              from MercyGuide visually obscures it during a Speak session. */}
          <ChatSupportButton />
        </>
      )}
    </div>
  );
}

function AdminLayoutShell() {
  return (
    <AdminLayout>
      <Suspense fallback={<RouteFallback />}>
        <Outlet />
      </Suspense>
    </AdminLayout>
  );
}

function RouterBeacon() {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.MB_ROUTER_VERSION = MB_ROUTER_VERSION;
      }
      // Only expose router version in DOM during development
      if (import.meta.env.DEV && typeof document !== "undefined") {
        document.documentElement.setAttribute(
          "data-mb-router-version",
          MB_ROUTER_VERSION,
        );
      }
    } catch { /* ignore */ }
  }, []);
  return null;
}

// ── Router ────────────────────────────────────────────────────────────────────

export default function AppRouter() {
  return (
    <>
      <RouterBeacon />

      {/* A9 — global level-up celebration. Listens for the XP-awarded
          event and pops once per (user, level). Kept in the app shell
          because it mounts on every route and is tiny; avoiding a
          separate global modal chunk removes a stale-deploy failure
          point on unrelated pages like /pricing. */}
      <LevelUpModal />

      {/* A3 — milestone observer + certificate toast. Both gate
          themselves on the `certificates_enabled` feature flag. The
          observer stays lazy because it performs background certificate
          checks; the toast is shell-mounted to avoid a separate global
          toast chunk on every route. */}
      <Suspense fallback={null}>
        <MilestoneObserver />
      </Suspense>
      <CertificateToast />

      <Routes>
        {/* Public auth routes */}
        <Route path="/signin" element={<LazyPage><LoginPage /></LazyPage>} />
        {/* /signup is the most-guessed account URL. ALIAS (render LoginPage
            directly, keep /signup in the URL bar) rather than redirect to
            /signin: LoginPage is a combined sign-in / create-account page
            ("Đăng nhập hoặc tạo tài khoản"), so /signup is not a
            misdirection — it lands exactly where the user intended. /login
            stays a redirect because it's a pure synonym for the same
            (sign-in) intent. No hyphenated /sign-up: the existing /login
            alias has no /log-in counterpart — match the pattern (A79 D1). */}
        <Route path="/signup" element={<LazyPage><LoginPage /></LazyPage>} />
        <Route path="/login"  element={<LoginRedirect />} />

        <Route path="/reset-password"
          element={<LazyPage><ResetPasswordPage /></LazyPage>} />

        {/* Anonymous → permanent account conversion. Auth-required (the
            page redirects home if the caller is already a permanent
            account). */}
        <Route path="/auth/save-progress"
          element={<LazyPage><ConvertAccountPage /></LazyPage>} />

        {/* Family bulk-invite recipient page — public landing /invite/:token */}
        <Route path="/invite/:token"
          element={<LazyPage><AcceptInvitePage /></LazyPage>} />

        {/* Bulk-invite UI for the inviter — auth-required */}
        <Route path="/referral/invite-family"
          element={<LazyPage><BulkInvitePage /></LazyPage>} />

        {/* /auth redirects preserve query/hash for OAuth callbacks */}
        <Route path="/auth"          element={<AuthRedirect />} />
        <Route path="/auth/callback" element={<AuthRedirect />} />

        <Route element={<AppHeroShell />}>
          {/* Onboarding — the PUBLIC pair-selection picker. Anonymous
              visitors land here as the entry point (locked #14); a
              signed-in user whose profile native_language is still NULL
              is redirected here by Home's own gate. NOT auth-wrapped.
              Reachable directly; it does not pass through the `/` gate,
              so it cannot loop (it writes the pair on finish AND skip). */}
          <Route
            path="/onboarding"
            element={<LazyPage><OnboardingPage /></LazyPage>}
          />

          {/* Public pages */}
          <Route
            path="/"
            element={
              <AnonymousOnboardingGate
                firstTimeAnonymous={
                  <LazyPage><MarketingLandingPage /></LazyPage>
                }
              >
                <LazyPage><Home /></LazyPage>
              </AnonymousOnboardingGate>
            }
          />
          <Route path="/privacy" element={<LazyPage><Privacy /></LazyPage>} />
          <Route path="/terms"   element={<LazyPage><Terms /></LazyPage>} />
          {/* App Store / Play Store paperwork prefers /legal/* paths. Same components. */}
          <Route path="/legal/privacy" element={<LazyPage><Privacy /></LazyPage>} />
          <Route path="/legal/terms"   element={<LazyPage><Terms /></LazyPage>} />
          <Route path="/legal/content-advisory" element={<LazyPage><ContentAdvisory /></LazyPage>} />
          <Route path="/support" element={<LazyPage><Support /></LazyPage>} />
          <Route path="/pricing" element={<LazyPage><Pricing /></LazyPage>} />
          <Route path="/upgrade" element={<LazyPage><Pricing /></LazyPage>} />
          <Route path="/rooms"   element={<LazyPage><AllRooms /></LazyPage>} />

          {/* Public blog */}
          <Route path="/blog"        element={<LazyPage><BlogIndex /></LazyPage>} />
          {/* A9 — public weekly community digest archive (more specific than /blog/:slug) */}
          <Route path="/blog/weekly-digest" element={<LazyPage><WeeklyDigest /></LazyPage>} />
          <Route path="/blog/weekly-digest/:weekStart" element={<LazyPage><WeeklyDigest /></LazyPage>} />
          <Route path="/blog/:slug"  element={<LazyPage><BlogPost /></LazyPage>} />

          {/* Public certificate verification — no auth required */}
          <Route path="/cert/:code" element={<LazyPage><CertVerifyPage /></LazyPage>} />

          <Route path="/tiers"   element={<LazyPage><TierIndex /></LazyPage>} />
          <Route path="/tiers/:tierId" element={<LazyPage><TierDetail /></LazyPage>} />
          <Route path="/redeem"     element={<RedeemRedirect />} />
          <Route path="/promo-code" element={<RedeemRedirect />} />

          {/* SEO landing pages — public, Vietnamese-keyword targeted */}
          <Route path="/seo/hoc-tieng-anh-cho-nguoi-viet"
            element={<LazyPage><SeoHocTiengAnhChoNguoiVietPage /></LazyPage>} />
          <Route path="/seo/sua-phat-am-tieng-anh"
            element={<LazyPage><SeoSuaPhatAmTiengAnhPage /></LazyPage>} />
          <Route path="/seo/loi-tieng-anh-nguoi-viet-hay-sai"
            element={<LazyPage><SeoLoiTiengAnhNguoiVietPage /></LazyPage>} />
          <Route path="/seo/phong-van-tieng-anh"
            element={<LazyPage><SeoPhongVanTiengAnhPage /></LazyPage>} />
          <Route path="/seo/hoc-tieng-anh-mien-phi"
            element={<LazyPage><SeoHocTiengAnhMienPhiPage /></LazyPage>} />

          {/* Per-topic SEO landing pages — public, no auth, lazy-loaded.
              Each one is its own SERP entry-point for Vietnamese learners
              searching for a specific exam topic. */}
          <Route path="/vstep/speaking/:topicId"
            element={<LazyPage><VstepTopicPage /></LazyPage>} />
          <Route path="/toeic/practice/:itemId"
            element={<LazyPage><ToeicTopicPage /></LazyPage>} />
          <Route path="/ielts/writing/topic/:topicId"
            element={<LazyPage><IeltsTopicPage /></LazyPage>} />

          {/* Developer portal — Step 11 public API; intentionally public. */}
          <Route path="/dev/api"
            element={<LazyPage><DeveloperPortalPage /></LazyPage>} />

          {/* Placement test — gated by FEATURE_FLAGS.PLACEMENT_TEST_ENABLED
              (default false; see featureFlags.ts). Flag OFF → every
              /placement* path redirects to home BEFORE any lazy mount
              (engine never renders, no placement analytics/Sentry). Flag
              ON → v3 multimodal session under PlacementV3Gate. v2 was
              retired in PR-A (chore/c4-v2-retirement-pr-a); v3 has owned
              the path since #1159 wired the profiles writeback. */}
          <Route path="/placement"
            element={
              isPlacementV3RouteAvailable() ? (
                <PlacementV3Gate>
                  <PlacementRouteShell routeName="placement_welcome">
                    <LazyPage><PlacementV3WelcomePage /></LazyPage>
                  </PlacementRouteShell>
                </PlacementV3Gate>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/placement/who"
            element={
              isPlacementV3RouteAvailable() ? (
                <PlacementV3Gate>
                  <PlacementRouteShell routeName="placement_who_for">
                    <LazyPage><PlacementV3WhoForPage /></LazyPage>
                  </PlacementRouteShell>
                </PlacementV3Gate>
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/placement/test"
            element={
              isPlacementEntryRouteAvailable() ? (
                <Navigate to="/placement" replace />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/placement/results"
            element={
              isPlacementEntryRouteAvailable() ? (
                <Navigate to="/placement" replace />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/placement/test/:sessionId"
            element={
              <PlacementV3Gate>
                <PlacementRouteShell routeName="placement_test">
                  <LazyPage><PlacementV3TestPage /></LazyPage>
                </PlacementRouteShell>
              </PlacementV3Gate>
            }
          />
          <Route path="/placement/results/:sessionId"
            element={
              <PlacementV3Gate>
                <PlacementRouteShell routeName="placement_results">
                  <LazyPage><PlacementV3ResultsPage /></LazyPage>
                </PlacementRouteShell>
              </PlacementV3Gate>
            }
          />
          <Route path="/placement/resume"
            element={
              <PlacementV3Gate>
                <PlacementRouteShell routeName="placement_resume">
                  <LazyPage><PlacementV3ResumePage /></LazyPage>
                </PlacementRouteShell>
              </PlacementV3Gate>
            }
          />
          <Route path="/placement/skip"
            element={
              <PlacementV3Gate>
                <PlacementRouteShell routeName="placement_skip_confirm">
                  <LazyPage><PlacementV3SkipConfirmPage /></LazyPage>
                </PlacementRouteShell>
              </PlacementV3Gate>
            }
          />

          {/* Speech drill — page self-gates on pronunciationScoringEnabled flag */}
          <Route path="/speak"
            element={
              <RequireAuth>
                <LazyPage><SpeechDrillPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Targeted phoneme drill — 5-minute focused practice on
              one phoneme. Self-gates on pronunciationScoringEnabled
              and renders an anon CTA when signed out. */}
          <Route path="/practice/phoneme/:phonemeSlug"
            element={<LazyPage><PhonemeDrillPage /></LazyPage>}
          />

          {/* Pronunciation SRS session (A4) — mock queue today; the
              `pronunciation_srs_enabled` flag will gate inside the
              page once the SRS RPCs land. Auth-required because the
              card calls A2's scorePronunciation, which needs a JWT. */}
          <Route path="/pronunciation/srs"
            element={
              <RequireAuth>
                <LazyPage><PronunciationSRSSessionPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Real-world listening library — auth-required. Index +
              per-clip player. Audio_url backfilled by a separate TTS
              job; UI degrades to transcript-only when null. */}
          <Route path="/listening"
            element={
              <RequireAuth>
                <LazyPage><ListeningLibraryPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/listening/:clipId"
            element={
              <RequireAuth>
                <LazyPage><ListeningClipPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Vocabulary SRS — library + daily review session.
              Both auth-required; pages self-render an anon CTA when
              the user lands here without a session. */}
          <Route path="/vocabulary"
            element={
              <RequireAuth>
                <LazyPage><VocabularyLibraryPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/vocabulary/review"
            element={
              <RequireAuth>
                <LazyPage><VocabularyReviewPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Daily pronunciation challenge — anon-viewable; the page
              renders a sign-in nudge instead of the recorder when
              the visitor is not authenticated. */}
          <Route path="/challenge"
            element={<LazyPage><DailyChallengePage /></LazyPage>}
          />
          <Route path="/challenge/history"
            element={
              <RequireAuth>
                <LazyPage><ChallengeHistoryPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Speech history — page self-gates on pronunciationScoringEnabled flag */}
          <Route path="/speech/history"
            element={
              <RequireAuth>
                <LazyPage><SpeechHistoryPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Progress dashboard — page self-gates on pronunciationScoringEnabled
              and renders the anon empty state for signed-out callers. */}
          <Route path="/progress"
            element={<LazyPage><ProgressPage /></LazyPage>}
          />

          {/* Stage 3A — local weakness map. Reads from this device only
              (per docs/stage-3a/local-weakness-map-design.md), distinct
              from /progress's Supabase aggregation. Anon-viewable; the
              underlying component renders its own empty state. */}
          <Route path="/weak-at"
            element={<LazyPage><WeakAtPage /></LazyPage>}
          />

          {/* Public weekly leaderboard — anon-viewable */}
          <Route path="/leaderboard"
            element={<LazyPage><LeaderboardPage /></LazyPage>}
          />

          {/* Public monthly referral leaderboard — anon-viewable */}
          <Route path="/leaderboard/referral"
            element={<LazyPage><MonthlyReferralLeaderboard /></LazyPage>}
          />

          {/* Profession packs — vocational English verticals (anon-viewable). */}
          <Route path="/professions"
            element={<LazyPage><ProfessionsIndexPage /></LazyPage>}
          />
          <Route path="/professions/nail-tech"
            element={<LazyPage><NailTechLessonsPage /></LazyPage>}
          />
          <Route path="/professions/restaurant"
            element={<LazyPage><RestaurantLessonsPage /></LazyPage>}
          />
          <Route path="/professions/customer-service"
            element={<LazyPage><CustomerServiceLessonsPage /></LazyPage>}
          />
          <Route path="/professions/tech-worker"
            element={<LazyPage><TechWorkerLessonsPage /></LazyPage>}
          />
          <Route path="/professions/healthcare"
            element={<LazyPage><HealthcareLessonsPage /></LazyPage>}
          />
          <Route path="/professions/drivers"
            element={<LazyPage><DriversLessonsPage /></LazyPage>}
          />
          <Route path="/professions/hospitality"
            element={<LazyPage><HospitalityLessonsPage /></LazyPage>}
          />

          {/* Language learning verticals */}
          <Route path="/languages"
            element={<LazyPage><LanguagesIndexPage /></LazyPage>}
          />
          <Route path="/languages/french"
            element={<LazyPage><FrenchLessonsPage /></LazyPage>}
          />
          <Route path="/languages/german"
            element={<LazyPage><GermanLessonsPage /></LazyPage>}
          />
          <Route path="/languages/japanese"
            element={<LazyPage><JapaneseLessonsPage /></LazyPage>}
          />
          <Route path="/languages/chinese"
            element={<LazyPage><ChineseLessonsPage /></LazyPage>}
          />
          <Route path="/languages/korean"
            element={<LazyPage><KoreanLessonsPage /></LazyPage>}
          />
          <Route path="/languages/vietnamese"
            element={<LazyPage><VietnameseLessonsPage /></LazyPage>}
          />
          <Route path="/languages/spanish"
            element={<LazyPage><SpanishLessonsPage /></LazyPage>}
          />
          <Route path="/kids/vi-english"
            element={<LazyPage><ViKidsEnglishTutorPage /></LazyPage>}
          />


          {/* Mercy v2 — multi-turn conversation thread (Step 7) */}
          <Route path="/mercy"
            element={
              <RequireAuth>
                <LazyPage><MercyThreadPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Mercy unified chat — single-pane chat that replaces the multi-tab
              drawer for users on the new default ('unified'). Legacy MercyGuide
              drawer is preserved on Home for the 'classic' opt-out. */}
          <Route path="/mercy/chat"
            element={<LazyPage><MercyUnifiedPage /></LazyPage>}
          />

          {/* AI Tutor shell is public; provider/runtime gates own real execution. */}
          {FEATURE_FLAGS.AI_TUTOR_UI_ENABLED ? (
            <Route path="/ai-tutor"
              element={
                <LazyPage><AiTutorPage /></LazyPage>
              }
            />
          ) : null}

          {/* Writing feedback (Step 7 / AI Teacher v2 — rule-based MVP) */}
          <Route path="/writing-feedback"
            element={
              <RequireAuth>
                <LazyPage><WritingFeedbackPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Real-life writing practice (40 prompts × AI feedback). */}
          <Route path="/writing"
            element={<LazyPage><WritingPracticePage /></LazyPage>}
          />
          <Route path="/writing/:promptId"
            element={<LazyPage><WritingPracticeSessionPage /></LazyPage>}
          />

          <Route path="/roleplay" element={<LazyPage><RoleplayPage /></LazyPage>} />

          {/* IELTS prep (Step 11) — auth-required; premium gate is in-page. */}
          <Route path="/exam/ielts"
            element={
              <RequireAuth>
                <LazyPage><IELTSIndexPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/exam/ielts/writing"
            element={
              <RequireAuth>
                <LazyPage><IELTSWritingPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/exam/ielts/speaking"
            element={
              <RequireAuth>
                <LazyPage><IELTSSpeakingPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/exam/ielts/listening"
            element={
              <RequireAuth>
                <LazyPage><IELTSListeningPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/exam/ielts/reading"
            element={
              <RequireAuth>
                <LazyPage><IELTSReadingPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/exam/ielts/estimator"
            element={
              <RequireAuth>
                <LazyPage><IELTSEstimatorPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* VSTEP (Vietnamese national English exam) — kept public
              so the Vietnamese-only moat is visible to anonymous visitors. */}
          <Route path="/exam/vstep"
            element={<LazyPage><VSTEPIndexPage /></LazyPage>} />
          <Route path="/exam/vstep/speaking"
            element={<LazyPage><VSTEPSpeakingPage /></LazyPage>} />
          <Route path="/exam/vstep/listening"
            element={<LazyPage><VSTEPListeningPage /></LazyPage>} />
          <Route path="/exam/vstep/reading"
            element={<LazyPage><VSTEPReadingPage /></LazyPage>} />
          <Route path="/exam/vstep/writing"
            element={<LazyPage><VSTEPWritingPage /></LazyPage>} />

          {/* Public roadmap (Step 11 / Trust moat) — visible to anyone signed in;
              vote button degrades to "sign in to vote" for anon users. */}
          <Route path="/roadmap"
            element={
              <RequireAuth>
                <LazyPage><PublicRoadmapPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Study groups (Step 6 / Community) — auth-gated; data RLS is auth-only too */}
          <Route path="/groups"
            element={
              <RequireAuth>
                <LazyPage><GroupsIndex /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/groups/new"
            element={
              <RequireAuth>
                <LazyPage><CreateGroupPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/groups/:id"
            element={
              <RequireAuth>
                <LazyPage><GroupPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Mock interviews (Step 7 / AI Teacher v2) — auth-gated; data RLS owner-only */}
          <Route path="/interview"
            element={
              <RequireAuth>
                <LazyPage><InterviewIndex /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/interview/:slug"
            element={
              <RequireAuth>
                <LazyPage><InterviewSessionPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/interview/:slug/summary"
            element={
              <RequireAuth>
                <LazyPage><InterviewSummaryPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Mock interview rooms (A9) — high-stakes professional scenarios; free-tier weekly gate */}
          <Route path="/mock-interview"
            element={
              <RequireAuth>
                <LazyPage><MockInterviewIndex /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/mock-interview/:scenarioId"
            element={
              <RequireAuth>
                <LazyPage><MockInterviewRoom /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Community-curated mock interview prompts (A11) — public list,
              auth-gated submission. See migration
              20260534000000_user_interview_prompts.sql. */}
          <Route path="/mock-interview/community"
            element={<LazyPage><CommunityPromptsPage /></LazyPage>}
          />
          <Route path="/mock-interview/submit-prompt"
            element={
              <RequireAuth>
                <LazyPage><SubmitInterviewPromptPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Profession packs (Step 10 / VN moat) — auth-gated; per-page paywall gate */}
          <Route path="/pack/nail-tech"
            element={
              <RequireAuth>
                <LazyPage><NailTechnicianPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Protected pages — redirect to /signin if not authenticated */}
          {/* /account exposes billing + security surfaces; gated behind
              RequireAal2 so an aal=1 session cannot reach them when the
              user has MFA enrolled. */}
          <Route path="/account"
            element={
              <RequireAuth>
                <RequireAal2>
                  <LazyPage><AccountPage /></LazyPage>
                </RequireAal2>
              </RequireAuth>
            }
          />
          {/* A9 — XP history + level progress (auth-required). */}
          <Route path="/xp"
            element={
              <RequireAuth>
                <LazyPage><XPHistoryPage /></LazyPage>
              </RequireAuth>
            }
          />
          {/* A3 — Progress certificates gallery (auth-required). The
              `certificates_enabled` flag gates the *entry points*
              (nav links, toast, observer); rendering this URL
              directly when the flag is off is harmless because the
              page only ever reads from the certificates RPC and
              shows an empty state. */}
          <Route path="/certificates"
            element={
              <RequireAuth>
                <LazyPage><CertificatesGalleryPage /></LazyPage>
              </RequireAuth>
            }
          />
          {/* Notification preferences — auth-required granular email opt-out. */}
          <Route path="/account/notifications"
            element={
              <RequireAuth>
                <LazyPage><NotificationPreferencesPage /></LazyPage>
              </RequireAuth>
            }
          />
          {/* 2FA Phase 1 — security settings (paid-tier gated inside the page).
              RequireAal2 forces a TOTP challenge if the user has a verified
              factor but the session is at aal=1 — closes the post-password
              navigation bypass identified in the security review. */}
          <Route path="/account/security"
            element={
              <RequireAuth>
                <RequireAal2>
                  <LazyPage><SecuritySettingsPage /></LazyPage>
                </RequireAal2>
              </RequireAuth>
            }
          />
          {/* 2FA enrollment flow — paid-tier gated inside the page.
              No RequireAal2 here: a user enrolling for the first time has
              no verified factor yet, so the guard's predicate is always
              false. Disabling MFA from /account/security flows back through
              that route and is gated. */}
          <Route path="/auth/security"
            element={
              <RequireAuth>
                <LazyPage><Enable2FAPage /></LazyPage>
              </RequireAuth>
            }
          />
          {/* 2FA Phase 1 — forced TOTP challenge for aal=1 sessions
              that have a verified factor. Reached via the RequireAal2
              guard on protected routes. RequireAuth-wrapped (a logged-out
              visitor has nothing to challenge), but NOT RequireAal2-wrapped
              (this IS the page that satisfies the requirement). */}
          <Route path="/auth/challenge"
            element={
              <RequireAuth>
                <LazyPage><Aal2ChallengePage /></LazyPage>
              </RequireAuth>
            }
          />
          {/* 2FA Phase 2 — recovery flow (lost phone). Public route;
              the page itself does signInWithPassword + backup-code
              verify in sequence. NO RequireAuth wrapper because users
              landing here are NOT signed in yet. */}
          <Route path="/auth/recover"
            element={<LazyPage><RecoverWith2FAPage /></LazyPage>}
          />
          {/* Push notification preferences (auth-required) */}
          <Route path="/account/push-preferences"
            element={
              <RequireAuth>
                <LazyPage><PushPreferencesPage /></LazyPage>
              </RequireAuth>
            }
          />
          {/* Public token-based one-click unsubscribe. NO auth — the token
              IS the credential. Linked from every marketing email footer
              and from the List-Unsubscribe header. */}
          <Route path="/unsubscribe"
            element={<LazyPage><UnsubscribePage /></LazyPage>}
          />
          <Route path="/referral"
            element={
              <RequireAuth>
                <LazyPage><ReferralPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/billing"
            element={
              <RequireAuth>
                <LazyPage><BillingPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/billing/success"
            element={
              <RequireAuth>
                <LazyPage><BillingSuccessPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Public profile (anon-readable when is_public=true) */}
          <Route path="/u/:username" element={<LazyPage><PublicProfilePage /></LazyPage>} />

          {/* Share progress (auth-required — own stats) */}
          <Route path="/share/progress"
            element={
              <RequireAuth>
                <LazyPage><ShareProgressPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Gift subscriptions (Step 9) — auth-required for all three.
              Hidden on iOS native per App Store Guideline 4.0 (external payment). */}
          <Route path="/gift"
            element={
              <WebOnlyRoute>
                <RequireAuth>
                  <LazyPage><PurchaseGiftPage /></LazyPage>
                </RequireAuth>
              </WebOnlyRoute>
            }
          />
          <Route path="/gift/redeem"
            element={
              <WebOnlyRoute>
                <RequireAuth>
                  <LazyPage><RedeemGiftPage /></LazyPage>
                </RequireAuth>
              </WebOnlyRoute>
            }
          />
          <Route path="/gift/my"
            element={
              <WebOnlyRoute>
                <RequireAuth>
                  <LazyPage><MyGiftsPage /></LazyPage>
                </RequireAuth>
              </WebOnlyRoute>
            }
          />

          {/* VN cultural packs (Step 10) — public, no auth needed */}
          <Route path="/culture/vn"
            element={<LazyPage><VNCulturalIndexPage /></LazyPage>}
          />
          <Route path="/culture/vn/:packId"
            element={<LazyPage><VNCulturalPackPage /></LazyPage>}
          />

          {/* User testimonial collection — public stories index, owner
              share flow (auth-gated), and per-story detail page. */}
          <Route path="/stories"
            element={<LazyPage><StoriesPage /></LazyPage>}
          />
          <Route path="/stories/share"
            element={
              <RequireAuth>
                <LazyPage><ShareStoryPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/stories/:storyId"
            element={<LazyPage><StoryDetailPage /></LazyPage>}
          />

          {/* Community: user-generated sentences (Step 6) */}
          <Route path="/contribute"
            element={
              <RequireAuth>
                <LazyPage><ContributeSentencePage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/contribute/my-submissions"
            element={
              <RequireAuth>
                <LazyPage><MySubmissionsPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Family plan (Step 9 monetization) */}
          <Route path="/family"
            element={
              <RequireAuth>
                <LazyPage><FamilyPlanPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* TOEIC practice pack — open marketing surface (no auth, no
              paywall). 30 original L+R items with VI explanations,
              filters, and trap warnings. Drives the corporate-vertical
              monetization funnel; the paywalled timed practice still
              lives at /exam/toeic. */}
          <Route path="/exam-prep/toeic"
            element={<LazyPage><TOEICPracticePackPage /></LazyPage>}
          />

          {/* IELTS Speaking content pack — open marketing surface (no auth, no
              paywall). 30 topics across all 3 parts with VN-speaker
              strategies, vocabulary by band, and band-7/band-5 sample
              answers. The premium-gated practice route is /exam/ielts/speaking. */}
          <Route path="/exam-prep/ielts/speaking"
            element={<LazyPage><IELTSSpeakingContentPage /></LazyPage>}
          />
          <Route path="/exam-prep/ielts/speaking/:topicId"
            element={<LazyPage><IELTSSpeakingTopicPage /></LazyPage>}
          />

          {/* IELTS Listening content pack — open marketing surface. 30 items
              across all 4 sections with VN-listener strategies, vocab, and
              ElevenLabs-backed audio practice. Premium-gated practice route
              is /exam/ielts/listening. */}
          <Route path="/exam-prep/ielts/listening"
            element={<LazyPage><IELTSListeningContentPage /></LazyPage>}
          />
          <Route path="/exam-prep/ielts/listening/:itemId"
            element={<LazyPage><IELTSListeningItemPage /></LazyPage>}
          />

                    {/* IELTS Reading content pack — open marketing surface. Lists all
             reading passages with topic/band filters. Each card links to the
             detail page with full passage + questions + VN explanations. */}
          <Route path="/exam-prep/ielts/reading"
            element={<LazyPage><IELTSReadingContentPage /></LazyPage>}
          />
          <Route path="/exam-prep/ielts/reading/:passageId"
            element={<LazyPage><IELTSReadingPassagePage /></LazyPage>}
          />

          {/* IELTS Writing content pack — open marketing surface. Lists all
             Task 2 topics with type labels. Each card links to the detail
             page with prompt, approach outline, tips, and vocabulary. */}
          <Route path="/exam-prep/ielts/writing"
            element={<LazyPage><IELTSWritingContentPage /></LazyPage>}
          />
          <Route path="/exam-prep/ielts/writing/:topicId"
            element={<LazyPage><IELTSWritingTopicPage /></LazyPage>}
          />

          {/* TOEFL Speaking content pack — open marketing surface. 8 topics
              across all 4 task types with VN-speaker strategies, vocabulary
              by band, and band-7/band-5 sample answers. */}
          <Route path="/exam-prep/toefl/speaking"
            element={<LazyPage><TOEFLSpeakingContentPage /></LazyPage>}
          />
          <Route path="/exam-prep/toefl/speaking/:topicId"
            element={<LazyPage><TOEFLSpeakingTopicPage /></LazyPage>}
          />

          {/* TOEFL Listening content pack — open marketing surface. 4 items
              (2 conversations + 2 lectures) with VN-listener strategies,
              vocab, and full scripts. */}
          <Route path="/exam-prep/toefl/listening"
            element={<LazyPage><TOEFLListeningContentPage /></LazyPage>}
          />
          <Route path="/exam-prep/toefl/listening/:itemId"
            element={<LazyPage><TOEFLListeningItemPage /></LazyPage>}
          />

          {/* TOEFL Reading content pack — open marketing surface. Lists all
              reading passages with topic/band filters. Each card links to the
              detail page with full passage + questions + VN explanations. */}
          <Route path="/exam-prep/toefl/reading"
            element={<LazyPage><TOEFLReadingContentPage /></LazyPage>}
          />
          <Route path="/exam-prep/toefl/reading/:passageId"
            element={<LazyPage><TOEFLReadingPassagePage /></LazyPage>}
          />

          {/* TOEFL Writing content pack — open marketing surface. Lists all
              Task 1 (Integrated) and Task 2 (Academic Discussion) topics. */}
          <Route path="/exam-prep/toefl/writing"
            element={<LazyPage><TOEFLWritingContentPage /></LazyPage>}
          />
          <Route path="/exam-prep/toefl/writing/:topicId"
            element={<LazyPage><TOEFLWritingTopicPage /></LazyPage>}
          />

          {/* TOEIC prep (Step 11 — premium-gated; gate is inside the page) */}
          <Route path="/exam/toeic"
            element={
              <RequireAuth>
                <LazyPage><TOEICIndexPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* TOEFL iBT prep (Step 11 — scaffolding; premium gate is in-page, auth-required) */}
          <Route path="/exam/toefl"
            element={
              <RequireAuth>
                <LazyPage><TOEFLIndexPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/exam/toefl/reading"
            element={
              <RequireAuth>
                <LazyPage><TOEFLReadingPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/exam/toefl/listening"
            element={
              <RequireAuth>
                <LazyPage><TOEFLListeningPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/exam/toefl/speaking"
            element={
              <RequireAuth>
                <LazyPage><TOEFLSpeakingPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/exam/toefl/writing"
            element={
              <RequireAuth>
                <LazyPage><TOEFLWritingPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/exam/toefl/estimator"
            element={
              <RequireAuth>
                <LazyPage><TOEFLEstimatorPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/exam/toeic/practice/:sectionId"
            element={
              <RequireAuth>
                <LazyPage><TOEICPracticePage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/exam/toeic/estimator"
            element={
              <RequireAuth>
                <LazyPage><TOEICEstimatorPage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Corporate / school multi-seat (Step 9) */}
          <Route path="/corporate"
            element={
              <RequireAuth>
                <LazyPage><CorporateDashboardPage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/corporate/setup"
            element={
              <RequireAuth>
                <LazyPage><CreateCorporatePage /></LazyPage>
              </RequireAuth>
            }
          />
          <Route path="/corporate/join"
            element={
              <RequireAuth>
                <LazyPage><JoinCorporatePage /></LazyPage>
              </RequireAuth>
            }
          />

          {/* Room alias redirects */}
          <Route path="/room/room/:roomId" element={<RoomRoomRedirect />} />
          <Route path="/room"              element={<RoomIndexRedirect />} />
          <Route path="/rooms/room/:roomId" element={<RoomsRoomRedirect />} />
          <Route path="/rooms/:roomId"     element={<RoomsDirectRedirect />} />
          <Route path="/chat/:roomId"      element={<ChatAliasRedirect />} />

          <Route
            path="/room/:roomId"
            element={
              <RequireAuthForRoom>
                <RequireTrialActive>
                  <LazyPage><ChatHub /></LazyPage>
                </RequireTrialActive>
              </RequireAuthForRoom>
            }
          />

          {/* Teacher review portal (A11) — auth-required + admin level >= 5
              gate enforced by TeacherRoute. RLS additionally restricts
              data access at the row level. */}
          <Route
            path="/teacher"
            element={
              <RequireAuth>
                <LazyPage><TeacherRoute /></LazyPage>
              </RequireAuth>
            }
          >
            <Route index element={<LazyPage><TeacherReviewQueuePage /></LazyPage>} />
            <Route
              path="review/:itemId"
              element={<LazyPage><TeacherReviewItemPage /></LazyPage>}
            />
          </Route>

          {/* Admin routes */}
          <Route path="/admin/*" element={<AdminRoute />}>
            <Route element={<AdminLayoutShell />}>
              <Route index element={<LazyPage><AdminDashboard /></LazyPage>} />
              <Route path="users"                element={<LazyPage><AdminUsersPage /></LazyPage>} />
              <Route path="payments"             element={<LazyPage><AdminPaymentsPage /></LazyPage>} />
              <Route path="access-codes"         element={<LazyPage><AdminAccessCodes /></LazyPage>} />
              <Route path="audio-coverage"       element={<LazyPage><AudioCoveragePage /></LazyPage>} />
              <Route path="feedback"             element={<LazyPage><AdminFeedbackPage /></LazyPage>} />
              <Route path="subscriptions"        element={<LazyPage><AdminSubscriptions /></LazyPage>} />
              <Route path="feature-flags"        element={<LazyPage><FeatureFlagsAdmin /></LazyPage>} />
              <Route path="feedback-triage"      element={<LazyPage><FeedbackTriagePage /></LazyPage>} />
              <Route path="analytics"            element={<LazyPage><AdminAnalyticsPage /></LazyPage>} />
              <Route path="latency"              element={<LazyPage><LatencyMonitoring /></LazyPage>} />
              <Route path="placement-forensics"  element={<LazyPage><PlacementForensicsDashboard /></LazyPage>} />
              <Route path="slo"                  element={<LazyPage><SloDashboard /></LazyPage>} />
              <Route path="slo/:sloId"           element={<LazyPage><SloDetail /></LazyPage>} />
              <Route path="cost-monitoring"      element={<LazyPage><CostMonitoring /></LazyPage>} />
              <Route path="frontend-perf"        element={<LazyPage><FrontendPerformance /></LazyPage>} />
              <Route path="retention"            element={<LazyPage><RetentionDashboard /></LazyPage>} />
              <Route path="behavioral"           element={<LazyPage><BehavioralAnalytics /></LazyPage>} />
              <Route path="pending-sentences"    element={<LazyPage><PendingSentencesPage /></LazyPage>} />
              <Route path="stories"              element={<LazyPage><StoryModerationPage /></LazyPage>} />
              <Route path="teacher-feedback"     element={<LazyPage><TeacherFeedbackTriagePage /></LazyPage>} />
              <Route path="interview-prompts"    element={<LazyPage><InterviewPromptsModerationPage /></LazyPage>} />
              <Route path="room-load-diagnostics" element={<LazyPage><RoomLoadDiagnostics /></LazyPage>} />
              <Route path="*" element={<LazyPage><AdminDashboard /></LazyPage>} />
            </Route>
          </Route>

          {import.meta.env.DEV && DevAudioTest ? (
            <Route path="/dev/audio-test" element={<LazyPage><DevAudioTest /></LazyPage>} />
          ) : null}

          {/* A7b sourcemap smoke test — page itself enforces the env-flag
              + query-param gate so it is inert by default in every env. */}
          <Route path="/__sentry-smoke-test" element={<LazyPage><SentrySmokeTest /></LazyPage>} />

          <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    <FeedbackBar />
    </>
  );
}
