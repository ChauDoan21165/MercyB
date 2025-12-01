# Mercy Blade Observability Architecture

## Overview
This document describes the logging, metrics, and monitoring infrastructure for Mercy Blade.

## Logging System

### Central Logger (`src/lib/logger.ts`)
Unified logging system with automatic database persistence and performance tracking.

**Key Features:**
- Environment-aware (dev vs prod)
- Structured context support
- Automatic DB persistence for errors/warnings in production
- Performance metrics tracking
- Specialized loggers for auth, payments, room loads

**Usage:**
```typescript
import { logger } from '@/lib/logger';

// Basic logging
logger.info('Loading room', { roomId, tier });
logger.error('Failed to load room', { error, roomId });

// Performance tracking
logger.performance('loadRoom', 150, { roomId });

// Specialized logging
logger.roomLoad(roomId, duration, success);
logger.auth('login', userId);
logger.payment('subscription_created', amount, tierId);
```

**Log Levels:**
- `info`: General information (dev only in console, logged to DB in prod if needed)
- `warn`: Warning conditions (logged to console and DB in prod)
- `error`: Error conditions (always logged to console and DB)
- `debug`: Debug information (dev only)

### Structured Log Context
All logs accept a `context` object with standardized fields:
- `scope`: Component/function name
- `route`: Current route/path
- `userId`: User ID (auto-extracted if not provided)
- `roomId`: Room identifier
- `tierId`: Subscription tier
- `errorStack`: Error stack trace
- Custom fields as needed

### Log Locations

**Frontend Components:**
- `ChatHub.tsx`: Room load lifecycle (start, success, failure)
- `KidsChat.tsx`: Access control, language switches
- `AudioPlayer.tsx`: Playback events, errors
- `roomLoader.ts`: Room loading, merging, validation
- `roomJsonResolver.ts`: JSON resolution, file not found
- `ErrorBoundary.tsx`: React error boundaries

**Edge Functions:**
- All edge functions use standardized logging with:
  - Function name
  - Request ID
  - User ID (if authenticated)
  - Key parameters
  - No sensitive data (JWT, full content)

**CI Scripts:**
- `validate-rooms-ci.js`: Room validation results
- `validate-room-links.js`: Link health results

## Metrics & Health Indicators

### Room Health Metrics
**Location:** `src/components/admin/UnifiedHealthCheck.tsx`

Tracked metrics:
- `totalRooms`: Total room count across all tiers
- `roomsWithIssues`: Rooms with validation issues
- `roomsWithoutAudio`: Rooms missing audio files
- `averageAudioCoverage`: Average % of entries with audio
- `roomsByTier`: Room count per tier (Free, VIP1-VIP9, Kids)

### Audio System Metrics
**Location:** Audio components

Tracked events:
- `audioPlayStart`: User initiates playback
- `audioPlayError`: Network or decode failure
- `audioPlaySuccess`: Successful playback start
- `audioErrorRate`: Per-session error rate

### Validation Metrics
**Location:** CI scripts + runtime validation

Tracked metrics:
- `roomsChecked`: Total rooms validated
- `errorsCount`: Critical validation errors
- `warningsCount`: Non-critical warnings
- `validationMode`: Current mode (strict/preview/wip)
- `validationFailuresByMode`: Failures grouped by mode

### Deep Scan & Spec Metrics
**Location:** Admin tools

Tracked events:
- `deep_scan_run`: Deep scan execution
- `room_spec_created`: Room specification creation
- Actor (admin user)
- Success/failure counts

### Room Load Performance
**Location:** `ChatHub.tsx`, `roomLoader.ts`

Sampled metrics:
- Load duration (start → data ready)
- Categorized: fast (<200ms), medium, slow (>1s)
- P95 approximation for admin dashboard

## Error Tracking

### Error Severity Levels
Mapped from error kinds to severity:

| Error Kind | Severity | Action |
|------------|----------|--------|
| `room_not_found` | warning | Show friendly message |
| `access_denied` | warning | Upgrade prompt |
| `auth_required` | warning | Login redirect |
| `json_invalid` | error | Admin notification |
| `server_failure` | critical | Alert + retry |
| `validation_failure` | error | Log + report |

### Error Boundary
**Location:** `src/components/ErrorBoundary.tsx`

Top-level React error boundary that:
- Catches component errors
- Logs with full context
- Shows friendly fallback UI
- Hides raw stacks in production
- Provides reset/recovery options

### Network Error Tracking
All API/Edge function calls wrapped in error handlers that:
- Map HTTP status codes to user messages
- Log network failures with URL and status
- Track repeated failures for alerting

### Supabase Auth Errors
Centralized handling of:
- Expired sessions → auto-redirect to login
- Invalid tokens → clear state + login
- Rate limits → friendly message

## Development Tools

### Dev Observability Panel
**Location:** `src/components/dev/DevObservabilityPanel.tsx`

Floating panel (dev only) showing:
- Current tier and validation mode
- Theme mode (light/dark/color)
- Last room load duration
- Recent error kind (if any)
- Quick access to logs

**Toggle:** Bottom-right floating button with 🔍 icon

### CI Pipeline Artifacts
GitHub Actions exports JSON reports:
- `room-validation-report.json`: Full validation results
- `room-link-health-report.json`: Link health status

Download from Actions run artifacts tab.

## Database Tables

### system_logs
Stores production logs (errors and warnings):
- `level`: Log level (info, warn, error)
- `message`: Log message
- `route`: Request route
- `user_id`: User identifier
- `metadata`: JSON context object
- `created_at`: Timestamp

### ui_health_issues
Stores detected UI/UX problems:
- `room_id`: Affected room
- `path`: Page path
- `issue_type`: Problem category
- `severity`: Issue severity
- `details`: JSON details

## Alert Candidates
Edge functions track repeated failures:
- Counter: N errors in M minutes
- Log entry: `kind: "alert_candidate"`
- Future: Integration with alerting service

## Validation Modes

### VITE_MB_VALIDATION_MODE
- `strict`: Enforce all rules, fail on any error
- `preview`: Warn on issues, allow deployment
- `wip`: Minimal validation for WIP content

Logged at:
- App startup
- CI pipeline start
- Visible in admin panel

## File Locations

### Core Files
- `src/lib/logger.ts`: Central logging utility
- `src/components/ErrorBoundary.tsx`: React error boundary
- `docs/OBSERVABILITY.md`: This document

### Admin Components
- `src/components/admin/UnifiedHealthCheck.tsx`: Room health dashboard
- `src/components/admin/AdminDashboard.tsx`: Metrics display

### CI Scripts
- `validate-rooms-ci.js`: Room validation
- `validate-room-links.js`: Link health validation

### Dev Tools
- `src/components/dev/DevObservabilityPanel.tsx`: Dev panel

## Best Practices

1. **Never log sensitive data**: JWTs, passwords, full user content
2. **Use structured context**: Always include roomId, tier, scope
3. **Log at boundaries**: Entry/exit of major operations
4. **Sample high-volume events**: Don't log every audio play, sample instead
5. **Fail gracefully**: Log errors but keep UX working
6. **Redact in production**: Hide stack traces from end users
7. **Use semantic log kinds**: Consistent naming for easy filtering

## Future Enhancements
- Real-time alerting integration (Discord, email)
- Metrics aggregation service
- Log search and filtering UI
- Performance trend graphs
- Automated anomaly detection
