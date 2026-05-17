# Human Launch Checklist (Last Mile)

## Payments
- [ ] Run iOS real-payment test (VIP3)
- [ ] Run Android real-payment test (VIP3)
- [ ] Confirm subscription unlocks instantly after payment
- [ ] Verify matching rows in `payment_transactions` + `user_subscriptions`

## Audio
- [ ] Run manual audio storage scan (see `AUDIO_STORAGE_MISMATCH_REPORT.md`)
- [ ] Fill in the audit table with actual counts
- [ ] Fix any missing audio in VIP3 / VIP4 / VIP5 / Free core

## Content / Rooms
- [ ] Apply `EMPTY_ROOMS_FIX_PLAN.md` (homepage_v1, obesity, stoicism)
- [ ] Confirm room count is stable in `/admin/system-metrics`

## Monitoring
- [ ] Open `/admin/system-metrics` and verify metrics look sane
- [ ] Open edge logs for `paypal-payment` and `system-metrics`
- [ ] Follow `POST_LAUNCH_MONITORING_PLAN.md` for first 24 hours
