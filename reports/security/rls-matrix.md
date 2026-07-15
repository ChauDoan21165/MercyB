# RLS Matrix

Static scan only. Source: `supabase/migrations/*.sql`; no live database probing.

## Summary
- migration_files: 267
- tables_observed: 201
- rls_enabled: 198
- rls_not_enabled: 3
- policies_observed: 483
- manifest_tables: 201
- manifest_drift_findings: 0

## Tables

| Table | Created In Migrations | RLS Enabled | Policies | Source |
|---|---:|---:|---:|---|
| `private.referral_leaderboard_all_time_private` | yes | no | 0 | `supabase/migrations/20260629000000_safe_referral_leaderboard_projection.sql:31` |
| `private.referral_leaderboard_monthly_private` | yes | no | 0 | `supabase/migrations/20260629000000_safe_referral_leaderboard_projection.sql:18` |
| `public.access_code_redemptions` | yes | yes | 3 | `supabase/migrations/20251120035109_f953afb9-e33f-41ae-adae-246683979ab4.sql:33` |
| `public.access_codes` | yes | yes | 5 | `supabase/migrations/20251120035109_f953afb9-e33f-41ae-adae-246683979ab4.sql:17` |
| `public.account_conversions` | yes | yes | 0 | `supabase/migrations/20260521000000_anon_account_conversion.sql:44` |
| `public.admin_access_audit` | yes | yes | 2 | `supabase/migrations/20251124083520_102a899d-9b3f-4eb9-83b9-eb285285c375.sql:47` |
| `public.admin_allowlist` | yes | yes | 1 | `supabase/migrations/20260301032412_v2_harden_roles_feedback.sql:415` |
| `public.admin_logs` | yes | yes | 2 | `supabase/migrations/20251209061329_a130ed75-23aa-4a3f-ab08-4298c2c04ca1.sql:13` |
| `public.admin_notification_preferences` | yes | yes | 1 | `supabase/migrations/20251022085803_8201ff3d-0bca-41b3-be57-57a6eeb083f7.sql:2` |
| `public.admin_notification_settings` | yes | yes | 4 | `supabase/migrations/20251122072719_1f3ec983-efaa-45df-ac9c-98af1e54e443.sql:2` |
| `public.admin_notifications` | yes | yes | 4 | `supabase/migrations/20251022085803_8201ff3d-0bca-41b3-be57-57a6eeb083f7.sql:11` |
| `public.admin_users` | yes | yes | 4 | `supabase/migrations/20251209061329_a130ed75-23aa-4a3f-ab08-4298c2c04ca1.sql:2` |
| `public.ai_price_catalog` | no | yes | 0 | `supabase/migrations/20260422020000_enable_rls_on_exposed_tables.sql:11` |
| `public.ai_product_catalog` | yes | yes | 0 | `supabase/migrations/20260318000000_add_ai_meter.sql:43` |
| `public.ai_settings` | yes | yes | 2 | `supabase/migrations/20251207021032_f37878c6-54ef-4346-9caf-f7426105073a.sql:13` |
| `public.ai_usage` | yes | yes | 3 | `supabase/migrations/20251130014951_c41b111d-0167-4b71-b953-d8c90943673d.sql:55` |
| `public.ai_usage_events` | yes | yes | 2 | `supabase/migrations/20251207021032_f37878c6-54ef-4346-9caf-f7426105073a.sql:2` |
| `public.ai_usage_logs` | yes | yes | 0 | `supabase/migrations/20260318000000_add_ai_meter.sql:1` |
| `public.alert_history` | yes | yes | 1 | `supabase/migrations/20260518000000_latency_events.sql:111` |
| `public.alert_pause` | yes | yes | 2 | `supabase/migrations/20260518000000_latency_events.sql:143` |
| `public.anonymous_user_cleanup_log` | yes | yes | 0 | `supabase/migrations/20260513000000_anon_user_cleanup.sql:71` |
| `public.api_request_logs` | yes | yes | 1 | `supabase/migrations/20260505000000_public_api_dev_keys.sql:60` |
| `public.app_feedback` | no | yes | 2 | `supabase/migrations/20260422030000_app_feedback_rls_policies.sql:16` |
| `public.app_settings` | yes | yes | 3 | `supabase/migrations/20251122135338_64647f83-5c6d-43cd-b542-f44119abdf8c.sql:2` |
| `public.apple_iap_events` | yes | yes | 0 | `supabase/migrations/20260321000000_add_apple_iap_events_and_constraints.sql:4` |
| `public.audio_audit_room` | yes | yes | 2 | `supabase/migrations/20251204173830_eb46e23f-48ac-409d-a423-a662c22d23c7.sql:2` |
| `public.audio_governance_reviews` | yes | yes | 2 | `supabase/migrations/20251205052539_8ab44b56-6866-4c58-ada8-015fa3780590.sql:4` |
| `public.audit_logs` | yes | yes | 2 | `supabase/migrations/20251130014951_c41b111d-0167-4b71-b953-d8c90943673d.sql:8` |
| `public.bank_payment_requests` | yes | yes | 3 | `supabase/migrations/20251203221306_b25d93a0-9f3a-4064-83d3-77a10e4e0e45.sql:2` |
| `public.bank_transfer_orders` | yes | yes | 5 | `supabase/migrations/20251209075112_f68235dc-77e4-411c-bf4e-234dbd4c8f69.sql:2` |
| `public.billing_entitlement_events` | yes | yes | 0 | `supabase/migrations/20260319000000_team_c_billing_foundation.sql:277` |
| `public.billing_price_map` | yes | yes | 0 | `supabase/migrations/20260403000000_billing_price_map.sql:5` |
| `public.billing_provider_events` | yes | yes | 0 | `supabase/migrations/20260319000000_team_c_billing_foundation.sql:233` |
| `public.client_error_alert_history` | yes | yes | 0 | `supabase/migrations/20260719000000_client_errors.sql:82` |
| `public.client_errors` | yes | yes | 2 | `supabase/migrations/20260719000000_client_errors.sql:11` |
| `public.cohort_retention_daily` | yes | yes | 0 | `supabase/migrations/20260535000000_cohort_retention.sql:27` |
| `public.companion_events` | yes | yes | 2 | `supabase/migrations/20251203124416_276daccd-2373-42d1-8ccb-2ab50223a8e5.sql:33` |
| `public.companion_state` | yes | yes | 3 | `supabase/migrations/20251203124416_276daccd-2373-42d1-8ccb-2ab50223a8e5.sql:2` |
| `public.content_review_status` | yes | yes | 3 | `supabase/migrations/20260533000000_teacher_feedback.sql:53` |
| `public.conversation_events` | yes | yes | 2 | `supabase/migrations/20260716000000_conversation_capture.sql:83` |
| `public.conversations` | yes | yes | 3 | `supabase/migrations/20260716000000_conversation_capture.sql:28` |
| `public.corporate_accounts` | yes | yes | 4 | `supabase/migrations/20260425140923_corporate_seats.sql:28` |
| `public.corporate_seat_invites` | yes | yes | 3 | `supabase/migrations/20260425140923_corporate_seats.sql:97` |
| `public.corporate_seats` | yes | yes | 3 | `supabase/migrations/20260425140923_corporate_seats.sql:76` |
| `public.correction_source_events` | yes | yes | 3 | `supabase/migrations/20260721000000_correction_source_events.sql:9` |
| `public.daily_challenges` | yes | yes | 3 | `supabase/migrations/20260424221000_xp_and_daily.sql:54` |
| `public.db_p95_snapshots` | yes | yes | 1 | `supabase/migrations/20260526000000_slo_incidents.sql:120` |
| `public.developer_accounts` | yes | yes | 1 | `supabase/migrations/20260505000000_public_api_dev_keys.sql:26` |
| `public.developer_api_keys` | yes | yes | 1 | `supabase/migrations/20260505000000_public_api_dev_keys.sql:36` |
| `public.email_audit` | yes | yes | 0 | `supabase/migrations/20260505020000_email_audit.sql:15` |
| `public.email_campaigns` | yes | yes | 3 | `supabase/migrations/20251209082742_78d3258c-c205-4f6d-9a6a-085697e6b9f1.sql:2` |
| `public.email_events` | yes | yes | 2 | `supabase/migrations/20251209082742_78d3258c-c205-4f6d-9a6a-085697e6b9f1.sql:17` |
| `public.email_sends_log` | yes | yes | 0 | `supabase/migrations/20260424031000_email_sends_log.sql:16` |
| `public.entitlement_events` | yes | yes | 2 | `supabase/migrations/20260315211233_unified_entitlements_and_subscriptions.sql:46` |
| `public.entitlements` | yes | yes | 1 | `supabase/migrations/20260519230000_create_entitlements_table.sql:57` |
| `public.family_invitations` | yes | yes | 2 | `supabase/migrations/20260528000000_family_invitations.sql:44` |
| `public.family_plan_invites` | yes | yes | 3 | `supabase/migrations/20260503000000_family_plans.sql:64` |
| `public.family_plan_members` | yes | yes | 3 | `supabase/migrations/20260503000000_family_plans.sql:46` |
| `public.family_plans` | yes | yes | 4 | `supabase/migrations/20260503000000_family_plans.sql:24` |
| `public.favorite_rooms` | yes | yes | 1 | `supabase/migrations/20251128132923_65345f28-0f57-430e-bb28-9f85403d6e10.sql:28` |
| `public.favorite_tracks` | yes | yes | 1 | `supabase/migrations/20251128132923_65345f28-0f57-430e-bb28-9f85403d6e10.sql:19` |
| `public.feature_flags` | yes | yes | 4 | `supabase/migrations/20251122032324_114d7a5a-45ee-4604-a750-51b845944d2c.sql:2` |
| `public.feature_outcome_events` | yes | yes | 2 | `supabase/migrations/20260701120000_feature_outcome_events.sql:16` |
| `public.feedback` | yes | yes | 5 | `supabase/migrations/20251020090513_b04b4e88-e94e-4dd0-9fae-86c8f448561d.sql:31` |
| `public.gift_codes` | yes | yes | 3 | `supabase/migrations/20251122042210_ca0aacbc-c16b-4d87-9d3f-fbfa37fc52f7.sql:2` |
| `public.gift_subscriptions` | yes | yes | 4 | `supabase/migrations/20260425083000_gift_subscriptions.sql:19` |
| `public.interview_sessions` | yes | yes | 4 | `supabase/migrations/20260501010000_interview_sessions.sql:31` |
| `public.ip_rate_limit` | yes | yes | 0 | `supabase/migrations/20260516000000_ip_rate_limit.sql:39` |
| `public.ip_rate_limit_hits` | yes | yes | 0 | `supabase/migrations/20260516000000_ip_rate_limit.sql:59` |
| `public.latency_aggregates` | yes | yes | 1 | `supabase/migrations/20260518000000_latency_events.sql:77` |
| `public.latency_events` | yes | yes | 1 | `supabase/migrations/20260518000000_latency_events.sql:46` |
| `public.leaderboard_weekly` | yes | yes | 3 | `supabase/migrations/20260429000000_leaderboard_weekly.sql:42` |
| `public.learner_interaction_capture` | yes | yes | 0 | `supabase/migrations/20260703000000_learner_interaction_capture.sql:32` |
| `public.learning_data_consent` | yes | yes | 0 | `supabase/migrations/20260703000000_learner_interaction_capture.sql:97` |
| `public.learning_events` | yes | yes | 2 | `supabase/migrations/20260708000000_learning_events.sql:12` |
| `public.lifetime_intent_signups` | yes | yes | 2 | `supabase/migrations/20260503010000_lifetime_intent.sql:24` |
| `public.listening_clips` | yes | yes | 1 | `supabase/migrations/20260604000000_listening_library.sql:22` |
| `public.login_attempts` | yes | yes | 3 | `supabase/migrations/20251120040607_4ff2005f-7d5c-4d11-a8c6-50222e51d0bb.sql:2` |
| `public.mercy_conversations` | yes | yes | 4 | `supabase/migrations/20260424040000_mercy_conversations.sql:26` |
| `public.mercy_feedback_daily_rollups` | no | yes | 0 | `supabase/migrations/20260422020000_enable_rls_on_exposed_tables.sql:14` |
| `public.mercy_feedback_events` | no | yes | 2 | `supabase/migrations/20260422020000_enable_rls_on_exposed_tables.sql:15` |
| `public.mercy_messages` | yes | yes | 3 | `supabase/migrations/20260424040000_mercy_conversations.sql:35` |
| `public.mercy_tts_usage` | yes | yes | 1 | `supabase/migrations/20260511000000_elevenlabs_tts.sql:49` |
| `public.mercy_unified_sessions` | yes | yes | 2 | `supabase/migrations/20260605000000_mercy_unified_session.sql:25` |
| `public.mercy_user_facts` | yes | yes | 4 | `supabase/migrations/20260501000000_mercy_user_facts.sql:19` |
| `public.mercy_worst_answers_daily` | no | yes | 0 | `supabase/migrations/20260422020000_enable_rls_on_exposed_tables.sql:16` |
| `public.metrics_history` | yes | yes | 2 | `supabase/migrations/20251125095700_971ab900-f95c-45f3-a0e8-a0a330d20fbc.sql:2` |
| `public.mfa_backup_codes` | yes | yes | 0 | `supabase/migrations/20260608000000_2fa_phase_2.sql:25` |
| `public.mfa_lockouts` | yes | yes | 0 | `supabase/migrations/20260608000000_2fa_phase_2.sql:79` |
| `public.mock_interview_sessions` | yes | yes | 1 | `supabase/migrations/20260519000000_mock_interview_rate_limit.sql:38` |
| `public.path_days` | yes | yes | 4 | `supabase/migrations/20251203093516_01ee89eb-2b58-4784-98fa-87da776286fd.sql:15` |
| `public.paths` | yes | yes | 2 | `supabase/migrations/20251203093516_01ee89eb-2b58-4784-98fa-87da776286fd.sql:2` |
| `public.payment_proof_audit_log` | yes | yes | 2 | `supabase/migrations/20251107030856_3e4aedc2-a9e3-4724-8f0c-bcf3246e78cf.sql:2` |
| `public.payment_proof_submissions` | yes | yes | 4 | `supabase/migrations/20251022041903_3b6a51f5-fafd-49f2-a630-5cef5f09cad2.sql:2` |
| `public.payment_transactions` | yes | yes | 4 | `supabase/migrations/20251120035109_f953afb9-e33f-41ae-adae-246683979ab4.sql:2` |
| `public.paywall_experiment_exposures` | yes | yes | 4 | `supabase/migrations/20260503020000_paywall_experiments.sql:42` |
| `public.perf_alert_history` | yes | yes | 1 | `supabase/migrations/20260531000000_web_vitals_events.sql:100` |
| `public.placement_item_exposure` | yes | yes | 1 | `supabase/migrations/20260619000000_placement_sessions.sql:127` |
| `public.placement_items` | yes | yes | 1 | `supabase/migrations/20260618000000_placement_items.sql:70` |
| `public.placement_responses` | yes | yes | 3 | `supabase/migrations/20260619000000_placement_sessions.sql:98` |
| `public.placement_sessions` | yes | yes | 4 | `supabase/migrations/20260619000000_placement_sessions.sql:71` |
| `public.placement_v3_failure_timelines` | yes | yes | 1 | `supabase/migrations/20260520125321_placement_v3_forensics.sql:29` |
| `public.placement_v3_forensic_events` | yes | yes | 1 | `supabase/migrations/20260520125321_placement_v3_forensics.sql:1` |
| `public.placement_v3_profiles` | yes | yes | 1 | `supabase/migrations/20260627000002_placement_v3_profiles.sql:6` |
| `public.placement_v3_responses` | yes | yes | 2 | `supabase/migrations/20260627000001_placement_v3_responses.sql:7` |
| `public.placement_v3_runtime_alerts` | yes | yes | 1 | `supabase/migrations/20260520125321_placement_v3_forensics.sql:45` |
| `public.placement_v3_sessions` | yes | yes | 3 | `supabase/migrations/20260627000000_placement_v3_sessions.sql:7` |
| `public.private_chat_requests` | yes | yes | 3 | `supabase/migrations/20251022212846_ebab8791-edfd-4336-9224-b245cdb6e5b0.sql:2` |
| `public.private_messages` | yes | yes | 3 | `supabase/migrations/20251022212846_ebab8791-edfd-4336-9224-b245cdb6e5b0.sql:37` |
| `public.profiles` | yes | yes | 6 | `supabase/migrations/20251020102436_3fe0bfa7-1dc7-4876-809e-df302d8fab77.sql:5` |
| `public.promo_codes` | yes | yes | 2 | `supabase/migrations/20251021125101_fd597923-7a0c-4430-bcf7-33fb4d7057ee.sql:2` |
| `public.pronunciation_challenges` | yes | yes | 1 | `supabase/migrations/20260607000000_pronunciation_challenges.sql:35` |
| `public.pronunciation_srs_items` | yes | yes | 4 | `supabase/migrations/20260612000000_pronunciation_srs.sql:93` |
| `public.push_preferences` | yes | yes | 1 | `supabase/migrations/20260527000000_push_notifications.sql:70` |
| `public.push_send_log` | yes | yes | 0 | `supabase/migrations/20260527000000_push_notifications.sql:111` |
| `public.push_tokens` | yes | yes | 1 | `supabase/migrations/20260527000000_push_notifications.sql:32` |
| `public.rate_limit_config` | yes | yes | 2 | `supabase/migrations/20251122032324_114d7a5a-45ee-4604-a750-51b845944d2c.sql:35` |
| `public.rate_limits` | yes | yes | 2 | `supabase/migrations/20251129123534_ae3950bb-23cc-4538-ab61-158464eee077.sql:37` |
| `public.referral_audit_log` | yes | yes | 1 | `supabase/migrations/20260524000000_referral_leaderboard.sql:91` |
| `public.referral_codes` | yes | yes | 2 | `supabase/migrations/20260429010000_referrals.sql:33` |
| `public.referral_leaderboard_all_time_public` | yes | yes | 1 | `supabase/migrations/20260629000000_safe_referral_leaderboard_projection.sql:66` |
| `public.referral_leaderboard_monthly_public` | yes | yes | 1 | `supabase/migrations/20260629000000_safe_referral_leaderboard_projection.sql:53` |
| `public.referral_leaderboard_optin` | yes | yes | 3 | `supabase/migrations/20260524000000_referral_leaderboard.sql:36` |
| `public.referral_uses` | yes | yes | 1 | `supabase/migrations/20260429010000_referrals.sql:70` |
| `public.responses` | yes | yes | 2 | `supabase/migrations/20251021090532_d9d92b8c-20ac-460b-bc64-fc3915228985.sql:20` |
| `public.review_log` | yes | yes | 2 | `supabase/migrations/20260603000000_vocabulary_srs.sql:58` |
| `public.roadmap_item_votes` | yes | yes | 3 | `supabase/migrations/20260505010000_voice_of_customer.sql:96` |
| `public.roadmap_items` | yes | yes | 2 | `supabase/migrations/20260505010000_voice_of_customer.sql:68` |
| `public.role_audit_log` | yes | yes | 1 | `supabase/migrations/20260301032412_v2_harden_roles_feedback.sql:186` |
| `public.room_assignments` | yes | yes | 2 | `supabase/migrations/20251021090532_d9d92b8c-20ac-460b-bc64-fc3915228985.sql:31` |
| `public.room_entries` | yes | yes | 3 | `supabase/migrations/20251207122320_691891fd-1b01-4780-9939-091a1c768ba9.sql:12` |
| `public.room_pins` | yes | yes | 1 | `supabase/migrations/20251117114829_4d42c95e-7aaf-4d62-9298-5e0c0566f8cb.sql:4` |
| `public.room_specification_assignments` | yes | yes | 2 | `supabase/migrations/20251128131351_0e37595f-5686-4fb8-9afb-fbf32548577b.sql:12` |
| `public.room_specifications` | yes | yes | 2 | `supabase/migrations/20251128131351_0e37595f-5686-4fb8-9afb-fbf32548577b.sql:2` |
| `public.room_usage_analytics` | yes | yes | 4 | `supabase/migrations/20251020100911_1cbf5f8d-d542-4a2a-b8fc-e608df44a947.sql:20` |
| `public.rooms` | yes | yes | 6 | `supabase/migrations/20251021090532_d9d92b8c-20ac-460b-bc64-fc3915228985.sql:2` |
| `public.security_events` | yes | yes | 2 | `supabase/migrations/20251114224559_85cda284-a455-4dff-bcc3-1a6c9ee0c929.sql:2` |
| `public.security_incidents` | yes | yes | 3 | `supabase/migrations/20251122064525_f2cecb16-a0cd-4d6a-8dae-875394c3f1ef.sql:23` |
| `public.security_monitoring_config` | yes | yes | 1 | `supabase/migrations/20251122064525_f2cecb16-a0cd-4d6a-8dae-875394c3f1ef.sql:2` |
| `public.sentry_crash_rate_snapshots` | yes | yes | 1 | `supabase/migrations/20260526000000_slo_incidents.sql:101` |
| `public.slo_burn_alerts` | yes | yes | 1 | `supabase/migrations/20260526000000_slo_incidents.sql:62` |
| `public.slo_incidents` | yes | yes | 1 | `supabase/migrations/20260526000000_slo_incidents.sql:33` |
| `public.speech_analysis_logs` | yes | yes | 1 | `supabase/migrations/20260506000000_speech_analysis_logs.sql:37` |
| `public.speech_attempts` | yes | yes | 4 | `supabase/migrations/20260309000000_create_speech_attempts.sql:5` |
| `public.stripe_events` | no | yes | 0 | `supabase/migrations/20260422020000_enable_rls_on_exposed_tables.sql:17` |
| `public.stripe_webhook_events` | yes | yes | 0 | `supabase/migrations/20260422020000_enable_rls_on_exposed_tables.sql:18` |
| `public.study_group_members` | yes | yes | 2 | `supabase/migrations/20260430000000_study_groups.sql:72` |
| `public.study_groups` | yes | yes | 4 | `supabase/migrations/20260430000000_study_groups.sql:51` |
| `public.study_log` | yes | yes | 3 | `supabase/migrations/20251203161837_d6146c0d-3b56-435b-9c0a-26f639170724.sql:2` |
| `public.subscription_tiers` | yes | yes | 2 | `supabase/migrations/20251020094557_3ba06735-3135-46de-bb93-2f80c36b31ff.sql:2` |
| `public.subscription_usage` | yes | yes | 4 | `supabase/migrations/20251020094557_3ba06735-3135-46de-bb93-2f80c36b31ff.sql:38` |
| `public.subscriptions` | yes | yes | 0 | `supabase/migrations/20260315211233_unified_entitlements_and_subscriptions.sql:1` |
| `public.system_logs` | yes | yes | 2 | `supabase/migrations/20251201050543_437009c0-246c-45b7-8f52-3bd571815cc6.sql:2` |
| `public.teacher_feedback` | yes | yes | 3 | `supabase/migrations/20260533000000_teacher_feedback.sql:69` |
| `public.teacher_memory` | yes | yes | 4 | `supabase/migrations/20260422001259_add_teacher_memory.sql:6` |
| `public.testimonials` | yes | yes | 2 | `supabase/migrations/20251201045405_6ed1e585-6fed-4725-9668-70cfab027861.sql:2` |
| `public.tts_usage_log` | yes | yes | 2 | `supabase/migrations/20251112070827_94165dd1-6023-4afc-b019-3ed9c295f425.sql:5` |
| `public.ui_health_issues` | yes | yes | 2 | `supabase/migrations/20251130072231_bb3437c1-2d23-43f7-9edb-53b539da14aa.sql:2` |
| `public.uptime_checks` | yes | yes | 2 | `supabase/migrations/20251122064525_f2cecb16-a0cd-4d6a-8dae-875394c3f1ef.sql:12` |
| `public.user_challenge_completion` | yes | yes | 3 | `supabase/migrations/20260607000000_pronunciation_challenges.sql:65` |
| `public.user_interview_prompt_votes` | yes | yes | 3 | `supabase/migrations/20260534000000_user_interview_prompts.sql:95` |
| `public.user_interview_prompts` | yes | yes | 5 | `supabase/migrations/20260534000000_user_interview_prompts.sql:56` |
| `public.user_listening_progress` | yes | yes | 1 | `supabase/migrations/20260604000000_listening_library.sql:60` |
| `public.user_moderation_status` | yes | yes | 2 | `supabase/migrations/20251021125101_fd597923-7a0c-4430-bcf7-33fb4d7057ee.sql:38` |
| `public.user_moderation_violations` | yes | yes | 3 | `supabase/migrations/20251021125101_fd597923-7a0c-4430-bcf7-33fb4d7057ee.sql:26` |
| `public.user_music_uploads` | yes | yes | 6 | `supabase/migrations/20251128132923_65345f28-0f57-430e-bb28-9f85403d6e10.sql:2` |
| `public.user_notebook_items` | yes | yes | 5 | `supabase/migrations/20260420225840_add_notebook.sql:5` |
| `public.user_notes` | yes | yes | 1 | `supabase/migrations/20251120035750_1197441c-3bf3-4779-8c12-eb6d2fbc97a4.sql:4` |
| `public.user_path_progress` | yes | yes | 4 | `supabase/migrations/20251203093516_01ee89eb-2b58-4784-98fa-87da776286fd.sql:35` |
| `public.user_placements` | yes | yes | 2 | `supabase/migrations/20260423120000_placement_test.sql:23` |
| `public.user_points` | yes | yes | 4 | `supabase/migrations/20251020130857_a7820a5f-2931-4cb0-8a8c-bce050181351.sql:5` |
| `public.user_promo_redemptions` | yes | yes | 3 | `supabase/migrations/20251021125101_fd597923-7a0c-4430-bcf7-33fb4d7057ee.sql:15` |
| `public.user_quotas` | yes | yes | 3 | `supabase/migrations/20251021090532_d9d92b8c-20ac-460b-bc64-fc3915228985.sql:42` |
| `public.user_referrals` | yes | yes | 2 | `supabase/migrations/20251201045405_6ed1e585-6fed-4725-9668-70cfab027861.sql:17` |
| `public.user_roles` | yes | yes | 9 | `supabase/migrations/20251020090513_b04b4e88-e94e-4dd0-9fae-86c8f448561d.sql:4` |
| `public.user_room_progress` | no | yes | 4 | `supabase/migrations/20260424000000_user_room_progress_writer_support.sql:34` |
| `public.user_security_status` | yes | yes | 3 | `supabase/migrations/20251120040607_4ff2005f-7d5c-4d11-a8c6-50222e51d0bb.sql:16` |
| `public.user_sessions` | yes | yes | 4 | `supabase/migrations/20251113133808_f53a2487-65c0-4aa4-8248-b8fc4d567c7a.sql:4` |
| `public.user_stories` | yes | yes | 7 | `supabase/migrations/20260523000000_user_stories.sql:40` |
| `public.user_submitted_sentences` | yes | yes | 4 | `supabase/migrations/20260425042419_user_sentences.sql:18` |
| `public.user_subscription_state` | no | yes | 0 | `supabase/migrations/20260422020000_enable_rls_on_exposed_tables.sql:19` |
| `public.user_subscriptions` | yes | yes | 4 | `supabase/migrations/20251020094557_3ba06735-3135-46de-bb93-2f80c36b31ff.sql:23` |
| `public.user_tiers` | yes | yes | 4 | `supabase/migrations/20251209000524_e50fdd6a-7d97-4ef9-92bb-e8208e9c218a.sql:2` |
| `public.user_vocabulary` | yes | yes | 4 | `supabase/migrations/20260603000000_vocabulary_srs.sql:25` |
| `public.user_writing_submissions` | yes | yes | 4 | `supabase/migrations/20260606000000_writing_practice.sql:61` |
| `public.user_xp` | yes | yes | 3 | `supabase/migrations/20260424221000_xp_and_daily.sql:21` |
| `public.v4_curriculum_plans` | yes | yes | 4 | `supabase/migrations/20260521000004_v5_curriculum_plans.sql:7` |
| `public.v4_learner_memory` | yes | yes | 4 | `supabase/migrations/20260520235959_v5_learner_memory.sql:6` |
| `public.v4_orchestration_snapshots` | yes | yes | 4 | `supabase/migrations/20260521000002_v5_orchestration_snapshots.sql:7` |
| `public.v4_provider_decisions` | yes | yes | 2 | `supabase/migrations/20260521000003_v5_provider_decisions.sql:8` |
| `public.v4_telemetry_events` | yes | yes | 3 | `supabase/migrations/20260521000001_v5_telemetry_events.sql:7` |
| `public.vip_room_requests` | yes | yes | 4 | `supabase/migrations/20251020100911_1cbf5f8d-d542-4a2a-b8fc-e608df44a947.sql:5` |
| `public.vip_topic_requests_detailed` | yes | yes | 4 | `supabase/migrations/20251021125701_150802ce-a03e-48b4-9426-d00e47e10e36.sql:28` |
| `public.vocabulary_srs_items` | yes | yes | 4 | `supabase/migrations/20260612000000_pronunciation_srs.sql:36` |
| `public.web_vitals_aggregates` | yes | yes | 1 | `supabase/migrations/20260531000000_web_vitals_events.sql:66` |
| `public.web_vitals_events` | yes | yes | 2 | `supabase/migrations/20260531000000_web_vitals_events.sql:25` |
| `public.weekly_digest_data` | yes | yes | 1 | `supabase/migrations/20260517000000_weekly_digest_aggregates.sql:45` |
| `public.weekly_leaderboard` | yes | yes | 3 | `supabase/migrations/20260510005000_weekly_leaderboard.sql:39` |
| `public.writing_prompts` | yes | yes | 2 | `supabase/migrations/20260606000000_writing_practice.sql:40` |
| `public.xp_events` | yes | yes | 1 | `supabase/migrations/20260609000000_xp_gamification.sql:57` |
| `storage.objects` | no | no | 32 | `supabase/migrations/20251022041144_b940bfd3-f646-4320-9c19-096ca641e13a.sql:5` |

## Policies

### private.referral_leaderboard_all_time_private
- RLS enabled: no
- Policies: none observed in migrations

### private.referral_leaderboard_monthly_private
- RLS enabled: no
- Policies: none observed in migrations

### public.access_code_redemptions
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can view all redemptions` | select | public | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251120035109_f953afb9-e33f-41ae-adae-246683979ab4.sql:70` |
| `System can insert redemptions` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20251120035109_f953afb9-e33f-41ae-adae-246683979ab4.sql:77` |
| `Users can view their own redemptions` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20251120035109_f953afb9-e33f-41ae-adae-246683979ab4.sql:73` |

### public.access_codes
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can delete access codes` | delete | authenticated | `public.get_admin_level(auth.uid()) >= 7` |  | `supabase/migrations/20260613010000_fix_access_codes_admin_model.sql:78` |
| `Admins can insert access codes` | insert | authenticated |  | `public.get_admin_level(auth.uid()) >= 7` | `supabase/migrations/20260613010000_fix_access_codes_admin_model.sql:63` |
| `Admins can select access codes` | select | authenticated | `public.get_admin_level(auth.uid()) >= 7` |  | `supabase/migrations/20260613010000_fix_access_codes_admin_model.sql:55` |
| `Admins can update access codes` | update | authenticated | `public.get_admin_level(auth.uid()) >= 7` | `public.get_admin_level(auth.uid()) >= 7` | `supabase/migrations/20260613010000_fix_access_codes_admin_model.sql:70` |
| `Users can view their assigned codes or public codes` | select | authenticated | `(is_active = true) AND ((expires_at IS NULL) OR (expires_at > now())) AND (for_user_id IS NULL OR for_user_id = auth.uid())` |  | `supabase/migrations/20251130002025_2cf6b5af-395d-4089-a5ba-095029229294.sql:34` |

### public.account_conversions
- RLS enabled: yes
- Policies: none observed in migrations

### public.admin_access_audit
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can view audit logs` | select | public | `public.has_role(auth.uid(), 'admin'::app_role)` |  | `supabase/migrations/20251124083520_102a899d-9b3f-4eb9-83b9-eb285285c375.sql:62` |
| `System can insert audit logs` | insert | public |  | `auth.uid() = admin_user_id` | `supabase/migrations/20251124083520_102a899d-9b3f-4eb9-83b9-eb285285c375.sql:68` |

### public.admin_allowlist
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can manage admin allowlist` | all | authenticated | `public.has_role(auth.uid(), 'admin'::public.app_role)` | `public.has_role(auth.uid(), 'admin'::public.app_role)` | `supabase/migrations/20260301032412_v2_harden_roles_feedback.sql:429` |

### public.admin_logs
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can insert logs` | insert | public |  | `public.get_admin_level(auth.uid()) > 0` | `supabase/migrations/20251209061329_a130ed75-23aa-4a3f-ab08-4298c2c04ca1.sql:112` |
| `Admins can view relevant logs` | select | public | `public.get_admin_level(auth.uid()) > 0` |  | `supabase/migrations/20251209061329_a130ed75-23aa-4a3f-ab08-4298c2c04ca1.sql:104` |

### public.admin_notification_preferences
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can manage their own preferences` | all | public | `auth.uid() = admin_user_id` |  | `supabase/migrations/20251022085803_8201ff3d-0bca-41b3-be57-57a6eeb083f7.sql:25` |

### public.admin_notification_settings
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can insert own notification settings` | insert | public |  | `EXISTS ( SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin' AND user_roles.user_id = admin_user_id )` | `supabase/migrations/20251122072719_1f3ec983-efaa-45df-ac9c-98af1e54e443.sql:27` |
| `Admins can update own notification settings` | update | public | `EXISTS ( SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin' AND user_roles.user_id = admin_user_id )` |  | `supabase/migrations/20251122072719_1f3ec983-efaa-45df-ac9c-98af1e54e443.sql:40` |
| `Admins can view own notification settings` | select | public | `EXISTS ( SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin' AND user_roles.user_id = admin_user_id )` |  | `supabase/migrations/20251122072719_1f3ec983-efaa-45df-ac9c-98af1e54e443.sql:14` |
| `only_admins_access_notification_settings` | all | authenticated | `has_role(auth.uid(), 'admin'::app_role)` |  | `supabase/migrations/20251201080440_051c8491-df9e-40ec-9454-7a25ca798a7d.sql:88` |

### public.admin_notifications
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can update their own notifications` | update | public | `auth.uid() = admin_user_id` |  | `supabase/migrations/20251022085803_8201ff3d-0bca-41b3-be57-57a6eeb083f7.sql:35` |
| `Admins can view their own notifications` | select | public | `auth.uid() = admin_user_id` |  | `supabase/migrations/20251022085803_8201ff3d-0bca-41b3-be57-57a6eeb083f7.sql:31` |
| `only_admins_access_admin_notifications` | all | authenticated | `has_role(auth.uid(), 'admin'::app_role)` |  | `supabase/migrations/20251201080440_051c8491-df9e-40ec-9454-7a25ca798a7d.sql:79` |
| `System can insert notifications for admins` | insert | public |  | `EXISTS ( SELECT 1 FROM public.user_roles WHERE user_id = admin_user_id AND role = 'admin' )` | `supabase/migrations/20251022085803_8201ff3d-0bca-41b3-be57-57a6eeb083f7.sql:40` |

### public.admin_users
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can view lower level admins` | select | public | `public.get_admin_level(auth.uid()) > 0 AND ( user_id = auth.uid() OR level < public.get_admin_level(auth.uid()) )` |  | `supabase/migrations/20251209061329_a130ed75-23aa-4a3f-ab08-4298c2c04ca1.sql:67` |
| `Higher level admins can delete lower level admins` | delete | public | `public.get_admin_level(auth.uid()) > level AND level < 10` |  | `supabase/migrations/20251209061329_a130ed75-23aa-4a3f-ab08-4298c2c04ca1.sql:94` |
| `Higher level admins can update lower level admins` | update | public | `public.get_admin_level(auth.uid()) > level AND level < 10` |  | `supabase/migrations/20251209061329_a130ed75-23aa-4a3f-ab08-4298c2c04ca1.sql:86` |
| `Level 9+ can create admins` | insert | public |  | `public.get_admin_level(auth.uid()) >= 9` | `supabase/migrations/20251209061329_a130ed75-23aa-4a3f-ab08-4298c2c04ca1.sql:78` |

### public.ai_price_catalog
- RLS enabled: yes
- Policies: none observed in migrations

### public.ai_product_catalog
- RLS enabled: yes
- Policies: none observed in migrations

### public.ai_settings
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can manage AI settings` | all | public | `has_role(auth.uid(), 'admin'::app_role)` |  | `supabase/migrations/20251207021032_f37878c6-54ef-4346-9caf-f7426105073a.sql:46` |
| `Anyone can read AI settings` | select | public | `true` |  | `supabase/migrations/20251207021032_f37878c6-54ef-4346-9caf-f7426105073a.sql:50` |

### public.ai_usage
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can view all AI usage` | select | public | `EXISTS ( SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'::app_role )` |  | `supabase/migrations/20251130014951_c41b111d-0167-4b71-b953-d8c90943673d.sql:81` |
| `ai_usage_service_insert` | insert | service_role |  | `true` | `supabase/migrations/20260621000000_scope_legacy_public_policies.sql:62` |
| `Users can view their own AI usage` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20251130014951_c41b111d-0167-4b71-b953-d8c90943673d.sql:94` |

### public.ai_usage_events
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can view all AI usage` | select | public | `has_role(auth.uid(), 'admin'::app_role)` |  | `supabase/migrations/20251207021032_f37878c6-54ef-4346-9caf-f7426105073a.sql:35` |
| `ai_usage_events_service_insert` | insert | service_role |  | `true` | `supabase/migrations/20260621000000_scope_legacy_public_policies.sql:69` |

### public.ai_usage_logs
- RLS enabled: yes
- Policies: none observed in migrations

### public.alert_history
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `admin_read_alert_history` | select | authenticated | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260518000000_latency_events.sql:131` |

### public.alert_pause
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `admin_read_alert_pause` | select | authenticated | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260518000000_latency_events.sql:157` |
| `admin_update_alert_pause` | update | authenticated | `public.get_admin_level(auth.uid()) >= 9` | `public.get_admin_level(auth.uid()) >= 9` | `supabase/migrations/20260518000000_latency_events.sql:163` |

### public.anonymous_user_cleanup_log
- RLS enabled: yes
- Policies: none observed in migrations

### public.api_request_logs
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `api_request_logs_admin_select` | select | public | `public.get_admin_level() >= 7` |  | `supabase/migrations/20260505000000_public_api_dev_keys.sql:95` |

### public.app_feedback
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `app_feedback_admin_read` | select | authenticated | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260422030000_app_feedback_rls_policies.sql:23` |
| `app_feedback_user_insert` | insert | authenticated |  | `user_id IS NULL OR user_id = auth.uid()` | `supabase/migrations/20260422030000_app_feedback_rls_policies.sql:32` |

### public.app_settings
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can insert app settings` | insert | authenticated |  | `EXISTS ( SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin' )` | `supabase/migrations/20251122135338_64647f83-5c6d-43cd-b542-f44119abdf8c.sql:46` |
| `Admins can update app settings` | update | authenticated | `EXISTS ( SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin' )` | `EXISTS ( SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin' )` | `supabase/migrations/20251122135338_64647f83-5c6d-43cd-b542-f44119abdf8c.sql:26` |
| `Admins can view app settings` | select | authenticated | `EXISTS ( SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin' )` |  | `supabase/migrations/20251122135338_64647f83-5c6d-43cd-b542-f44119abdf8c.sql:13` |

### public.apple_iap_events
- RLS enabled: yes
- Policies: none observed in migrations

### public.audio_audit_room
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can manage audio audit data` | all | public | `has_role(auth.uid(), 'admin'::app_role)` | `has_role(auth.uid(), 'admin'::app_role)` | `supabase/migrations/20251204173830_eb46e23f-48ac-409d-a423-a662c22d23c7.sql:13` |
| `Authenticated users can view audio audit data` | select | public | `auth.uid() IS NOT NULL` |  | `supabase/migrations/20251204173830_eb46e23f-48ac-409d-a423-a662c22d23c7.sql:20` |

### public.audio_governance_reviews
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can manage governance reviews` | all | public | `public.has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251205052539_8ab44b56-6866-4c58-ada8-015fa3780590.sql:28` |
| `Anyone can view governance reviews` | select | public | `true` |  | `supabase/migrations/20251205052539_8ab44b56-6866-4c58-ada8-015fa3780590.sql:34` |

### public.audit_logs
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can view audit logs` | select | public | `EXISTS ( SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'::app_role )` |  | `supabase/migrations/20251130014951_c41b111d-0167-4b71-b953-d8c90943673d.sql:30` |
| `System can insert audit logs` | insert | public |  | `auth.uid() = admin_id` | `supabase/migrations/20251130014951_c41b111d-0167-4b71-b953-d8c90943673d.sql:43` |

### public.bank_payment_requests
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admin can manage bank payments` | all | public | `has_role(auth.uid(), 'admin'::app_role)` |  | `supabase/migrations/20251203221306_b25d93a0-9f3a-4064-83d3-77a10e4e0e45.sql:30` |
| `User can insert own bank payments` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20251203221306_b25d93a0-9f3a-4064-83d3-77a10e4e0e45.sql:24` |
| `User can see own bank payments` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20251203221306_b25d93a0-9f3a-4064-83d3-77a10e4e0e45.sql:18` |

### public.bank_transfer_orders
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can update all orders` | update | public | `get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20251209075112_f68235dc-77e4-411c-bf4e-234dbd4c8f69.sql:50` |
| `Admins can view all orders` | select | public | `get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20251209075112_f68235dc-77e4-411c-bf4e-234dbd4c8f69.sql:44` |
| `Users can insert own orders` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20251209075112_f68235dc-77e4-411c-bf4e-234dbd4c8f69.sql:25` |
| `Users can update own pending orders` | update | public | `auth.uid() = user_id AND status = 'pending'` | `auth.uid() = user_id` | `supabase/migrations/20251209075112_f68235dc-77e4-411c-bf4e-234dbd4c8f69.sql:37` |
| `Users can view own orders` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20251209075112_f68235dc-77e4-411c-bf4e-234dbd4c8f69.sql:31` |

### public.billing_entitlement_events
- RLS enabled: yes
- Policies: none observed in migrations

### public.billing_price_map
- RLS enabled: yes
- Policies: none observed in migrations

### public.billing_provider_events
- RLS enabled: yes
- Policies: none observed in migrations

### public.client_error_alert_history
- RLS enabled: yes
- Policies: none observed in migrations

### public.client_errors
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `client_errors_anon_insert` | insert | anon |  | `user_id is null` | `supabase/migrations/20260719000000_client_errors.sql:64` |
| `client_errors_auth_insert` | insert | authenticated |  | `user_id is null or user_id = auth.uid()` | `supabase/migrations/20260719000000_client_errors.sql:71` |

### public.cohort_retention_daily
- RLS enabled: yes
- Policies: none observed in migrations

### public.companion_events
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Users can insert own companion events` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20251203124416_276daccd-2373-42d1-8ccb-2ab50223a8e5.sql:52` |
| `Users can read own companion events` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20251203124416_276daccd-2373-42d1-8ccb-2ab50223a8e5.sql:46` |

### public.companion_state
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Users can insert own companion state` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20251203124416_276daccd-2373-42d1-8ccb-2ab50223a8e5.sql:21` |
| `Users can read own companion state` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20251203124416_276daccd-2373-42d1-8ccb-2ab50223a8e5.sql:15` |
| `Users can update own companion state` | update | public | `auth.uid() = user_id` |  | `supabase/migrations/20251203124416_276daccd-2373-42d1-8ccb-2ab50223a8e5.sql:27` |

### public.content_review_status
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `admin_all_review_status` | all | public | `public.get_admin_level() >= 9` | `public.get_admin_level() >= 9` | `supabase/migrations/20260533000000_teacher_feedback.sql:141` |
| `teacher_select_review_queue` | select | public | `public.get_admin_level() >= 5 and status in ('in_review', 'needs_revision')` |  | `supabase/migrations/20260533000000_teacher_feedback.sql:117` |
| `teacher_update_review_status` | update | public | `public.get_admin_level() >= 5 and status in ('in_review', 'needs_revision')` | `public.get_admin_level() >= 5` | `supabase/migrations/20260533000000_teacher_feedback.sql:129` |

### public.conversation_events
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `conversation_events_insert_own` | insert | authenticated |  | `EXISTS ( SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND c.user_id = auth.uid() )` | `supabase/migrations/20260716000000_conversation_capture.sql:118` |
| `conversation_events_select_own` | select | authenticated | `EXISTS ( SELECT 1 FROM public.conversations c WHERE c.id = conversation_id AND c.user_id = auth.uid() )` |  | `supabase/migrations/20260716000000_conversation_capture.sql:130` |

### public.conversations
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `conversations_insert_own` | insert | authenticated |  | `user_id = auth.uid()` | `supabase/migrations/20260716000000_conversation_capture.sql:62` |
| `conversations_select_own` | select | authenticated | `user_id = auth.uid()` |  | `supabase/migrations/20260716000000_conversation_capture.sql:68` |
| `conversations_update_own` | update | authenticated | `user_id = auth.uid()` | `user_id = auth.uid()` | `supabase/migrations/20260716000000_conversation_capture.sql:74` |

### public.corporate_accounts
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `corporate_accounts_delete_owner` | delete | authenticated | `owner_user_id = auth.uid()` |  | `supabase/migrations/20260425140923_corporate_seats.sql:216` |
| `corporate_accounts_insert_self_as_owner` | insert | authenticated |  | `owner_user_id = auth.uid()` | `supabase/migrations/20260425140923_corporate_seats.sql:201` |
| `corporate_accounts_select_owner_or_seat` | select | authenticated | `owner_user_id = auth.uid() OR EXISTS ( SELECT 1 FROM public.corporate_seats s WHERE s.corporate_account_id = corporate_accounts.id AND s.user_id = auth.uid() )` |  | `supabase/migrations/20260425140923_corporate_seats.sql:187` |
| `corporate_accounts_update_owner` | update | authenticated | `owner_user_id = auth.uid()` | `owner_user_id = auth.uid()` | `supabase/migrations/20260425140923_corporate_seats.sql:208` |

### public.corporate_seat_invites
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `corporate_seat_invites_owner_delete` | delete | authenticated | `EXISTS ( SELECT 1 FROM public.corporate_accounts a WHERE a.id = corporate_seat_invites.corporate_account_id AND a.owner_user_id = auth.uid() )` |  | `supabase/migrations/20260425140923_corporate_seats.sql:290` |
| `corporate_seat_invites_owner_insert` | insert | authenticated |  | `EXISTS ( SELECT 1 FROM public.corporate_accounts a WHERE a.id = corporate_account_id AND a.owner_user_id = auth.uid() )` | `supabase/migrations/20260425140923_corporate_seats.sql:277` |
| `corporate_seat_invites_owner_select` | select | authenticated | `EXISTS ( SELECT 1 FROM public.corporate_accounts a WHERE a.id = corporate_seat_invites.corporate_account_id AND a.owner_user_id = auth.uid() )` |  | `supabase/migrations/20260425140923_corporate_seats.sql:264` |

### public.corporate_seats
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `corporate_seats_delete_owner_or_self` | delete | authenticated | `user_id = auth.uid() OR EXISTS ( SELECT 1 FROM public.corporate_accounts a WHERE a.id = corporate_seats.corporate_account_id AND a.owner_user_id = auth.uid() )` |  | `supabase/migrations/20260425140923_corporate_seats.sql:250` |
| `corporate_seats_insert_owner` | insert | authenticated |  | `EXISTS ( SELECT 1 FROM public.corporate_accounts a WHERE a.id = corporate_account_id AND a.owner_user_id = auth.uid() )` | `supabase/migrations/20260425140923_corporate_seats.sql:237` |
| `corporate_seats_select_owner_or_self` | select | authenticated | `user_id = auth.uid() OR EXISTS ( SELECT 1 FROM public.corporate_accounts a WHERE a.id = corporate_seats.corporate_account_id AND a.owner_user_id = auth.uid() )` |  | `supabase/migrations/20260425140923_corporate_seats.sql:223` |

### public.correction_source_events
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `correction_source_events_admin_select` | select | authenticated | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260721000000_correction_source_events.sql:58` |
| `correction_source_events_anon_insert` | insert | anon |  | `true` | `supabase/migrations/20260721000000_correction_source_events.sql:44` |
| `correction_source_events_auth_insert` | insert | authenticated |  | `true` | `supabase/migrations/20260721000000_correction_source_events.sql:51` |

### public.daily_challenges
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `daily_challenges_insert_own` | insert | authenticated |  | `auth.uid() = user_id` | `supabase/migrations/20260424221000_xp_and_daily.sql:82` |
| `daily_challenges_select_own` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260424221000_xp_and_daily.sql:75` |
| `daily_challenges_update_own` | update | authenticated | `auth.uid() = user_id` | `auth.uid() = user_id` | `supabase/migrations/20260424221000_xp_and_daily.sql:89` |

### public.db_p95_snapshots
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `admin_read_db_p95_snap` | select | authenticated | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260526000000_slo_incidents.sql:133` |

### public.developer_accounts
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `developer_accounts_admin_select` | select | public | `public.get_admin_level() >= 7` |  | `supabase/migrations/20260505000000_public_api_dev_keys.sql:85` |

### public.developer_api_keys
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `developer_api_keys_admin_select` | select | public | `public.get_admin_level() >= 7` |  | `supabase/migrations/20260505000000_public_api_dev_keys.sql:90` |

### public.email_audit
- RLS enabled: yes
- Policies: none observed in migrations

### public.email_campaigns
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can insert campaigns` | insert | public |  | `public.get_admin_level(auth.uid()) >= 9` | `supabase/migrations/20251209082742_78d3258c-c205-4f6d-9a6a-085697e6b9f1.sql:47` |
| `Admins can update campaigns` | update | public | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20251209082742_78d3258c-c205-4f6d-9a6a-085697e6b9f1.sql:51` |
| `Admins can view all campaigns` | select | public | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20251209082742_78d3258c-c205-4f6d-9a6a-085697e6b9f1.sql:44` |

### public.email_events
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can view all email events` | select | public | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20251209082742_78d3258c-c205-4f6d-9a6a-085697e6b9f1.sql:57` |
| `email_events_service_insert` | insert | service_role |  | `true` | `supabase/migrations/20260621000000_scope_legacy_public_policies.sql:104` |

### public.email_sends_log
- RLS enabled: yes
- Policies: none observed in migrations

### public.entitlement_events
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `entitlement_events_own_insert` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20260422020000_enable_rls_on_exposed_tables.sql:32` |
| `entitlement_events_own_read` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20260422020000_enable_rls_on_exposed_tables.sql:27` |

### public.entitlements
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `entitlements_select_own` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260519230000_create_entitlements_table.sql:130` |

### public.family_invitations
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `family_invitations_owner_revoke` | update | public | `inviter_user_id = auth.uid() AND status IN ('pending', 'sent')` | `inviter_user_id = auth.uid() AND status = 'revoked'` | `supabase/migrations/20260528000000_family_invitations.sql:125` |
| `family_invitations_owner_select` | select | authenticated | `inviter_user_id = auth.uid()` |  | `supabase/migrations/20260710000000_family_invitations_tighten_anon_select.sql:6` |

### public.family_plan_invites
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `family_plan_invites_owner_delete` | delete | authenticated | `EXISTS ( SELECT 1 FROM public.family_plans p WHERE p.id = family_plan_invites.family_plan_id AND p.owner_user_id = auth.uid() )` |  | `supabase/migrations/20260503000000_family_plans.sql:274` |
| `family_plan_invites_owner_insert` | insert | authenticated |  | `EXISTS ( SELECT 1 FROM public.family_plans p WHERE p.id = family_plan_id AND p.owner_user_id = auth.uid() )` | `supabase/migrations/20260503000000_family_plans.sql:261` |
| `family_plan_invites_owner_select` | select | authenticated | `EXISTS ( SELECT 1 FROM public.family_plans p WHERE p.id = family_plan_invites.family_plan_id AND p.owner_user_id = auth.uid() )` |  | `supabase/migrations/20260503000000_family_plans.sql:248` |

### public.family_plan_members
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `family_plan_members_delete_owner_or_self` | delete | authenticated | `user_id = auth.uid() OR EXISTS ( SELECT 1 FROM public.family_plans p WHERE p.id = family_plan_members.family_plan_id AND p.owner_user_id = auth.uid() )` |  | `supabase/migrations/20260503000000_family_plans.sql:234` |
| `family_plan_members_insert_owner` | insert | authenticated |  | `EXISTS ( SELECT 1 FROM public.family_plans p WHERE p.id = family_plan_id AND p.owner_user_id = auth.uid() )` | `supabase/migrations/20260503000000_family_plans.sql:221` |
| `family_plan_members_select_owner_or_self` | select | authenticated | `user_id = auth.uid() OR EXISTS ( SELECT 1 FROM public.family_plans p WHERE p.id = family_plan_members.family_plan_id AND p.owner_user_id = auth.uid() )` |  | `supabase/migrations/20260503000000_family_plans.sql:207` |

### public.family_plans
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `family_plans_delete_owner` | delete | authenticated | `owner_user_id = auth.uid()` |  | `supabase/migrations/20260503000000_family_plans.sql:200` |
| `family_plans_insert_self_as_owner` | insert | authenticated |  | `owner_user_id = auth.uid()` | `supabase/migrations/20260503000000_family_plans.sql:185` |
| `family_plans_select_owner_or_member` | select | authenticated | `owner_user_id = auth.uid() OR EXISTS ( SELECT 1 FROM public.family_plan_members m WHERE m.family_plan_id = family_plans.id AND m.user_id = auth.uid() )` |  | `supabase/migrations/20260503000000_family_plans.sql:171` |
| `family_plans_update_owner` | update | authenticated | `owner_user_id = auth.uid()` | `owner_user_id = auth.uid()` | `supabase/migrations/20260503000000_family_plans.sql:192` |

### public.favorite_rooms
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Users can manage their favorite rooms` | all | authenticated | `auth.uid() = user_id` | `auth.uid() = user_id` | `supabase/migrations/20251128132923_65345f28-0f57-430e-bb28-9f85403d6e10.sql:80` |

### public.favorite_tracks
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Users can manage their favorite tracks` | all | authenticated | `auth.uid() = user_id` | `auth.uid() = user_id` | `supabase/migrations/20251128132923_65345f28-0f57-430e-bb28-9f85403d6e10.sql:73` |

### public.feature_flags
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can manage feature flags` | all | public | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251130025208_97904352-5bc3-48e3-a37c-803495d0a4cc.sql:5` |
| `feature_flags_admin_insert` | insert | authenticated |  | `public.get_admin_level(auth.uid()) >= 9` | `supabase/migrations/20260425010000_admin_feature_flags_rls.sql:23` |
| `feature_flags_admin_select` | select | authenticated | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260714000000_feature_flags_admin_select_only.sql:20` |
| `feature_flags_admin_update` | update | authenticated | `public.get_admin_level(auth.uid()) >= 9` | `public.get_admin_level(auth.uid()) >= 9` | `supabase/migrations/20260425010000_admin_feature_flags_rls.sql:29` |

### public.feature_outcome_events
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `feature_outcome_events_insert_own` | insert | authenticated |  | `user_id = auth.uid()` | `supabase/migrations/20260701120000_feature_outcome_events.sql:38` |
| `feature_outcome_events_select_own` | select | authenticated | `user_id = auth.uid()` |  | `supabase/migrations/20260701120000_feature_outcome_events.sql:44` |

### public.feedback
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can update all feedback` | update | authenticated | `public.has_role(auth.uid(), 'admin'::public.app_role)` | `public.has_role(auth.uid(), 'admin'::public.app_role)` | `supabase/migrations/20260301032412_v2_harden_roles_feedback.sql:379` |
| `Admins can view all feedback` | select | authenticated | `public.has_role(auth.uid(), 'admin'::public.app_role)` |  | `supabase/migrations/20260301032412_v2_harden_roles_feedback.sql:373` |
| `authenticated users insert own feedback` | insert | authenticated |  | `user_id = auth.uid()` | `supabase/migrations/20260504010000_feedback_require_auth.sql:4` |
| `Users can insert their own feedback` | insert | authenticated |  | `(user_id is null or auth.uid() = user_id) and (created_by is null or created_by = auth.uid())` | `supabase/migrations/20260301032412_v2_harden_roles_feedback.sql:357` |
| `Users can view their own feedback` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260301032412_v2_harden_roles_feedback.sql:367` |

### public.gift_codes
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can manage gift codes` | all | public | `public.has_role(auth.uid(), 'admin'::app_role)` |  | `supabase/migrations/20251122042210_ca0aacbc-c16b-4d87-9d3f-fbfa37fc52f7.sql:19` |
| `Users can redeem gift codes` | update | authenticated | `is_active = true AND used_by IS NULL AND (code_expires_at IS NULL OR code_expires_at > now())` | `used_by = auth.uid() AND is_active = false AND used_at IS NOT NULL` | `supabase/migrations/20251207075419_9bb42f50-17c8-4208-8fd6-7905df438e8b.sql:4` |
| `Users can view available codes` | select | public | `auth.uid() IS NOT NULL AND is_active = true AND used_by IS NULL AND (code_expires_at IS NULL OR code_expires_at > now())` |  | `supabase/migrations/20251122042210_ca0aacbc-c16b-4d87-9d3f-fbfa37fc52f7.sql:25` |

### public.gift_subscriptions
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `gift_subs_purchaser_insert` | insert | public |  | `purchaser_user_id = auth.uid()` | `supabase/migrations/20260425083000_gift_subscriptions.sql:79` |
| `gift_subs_purchaser_select` | select | public | `purchaser_user_id = auth.uid()` |  | `supabase/migrations/20260425083000_gift_subscriptions.sql:73` |
| `gift_subs_recipient_select` | select | public | `recipient_user_id = auth.uid()` |  | `supabase/migrations/20260425083000_gift_subscriptions.sql:86` |
| `gift_subs_redeem` | update | public | `redeemed_at IS NULL AND expires_at > now()` | `recipient_user_id = auth.uid() AND redeemed_at IS NOT NULL` | `supabase/migrations/20260425083000_gift_subscriptions.sql:97` |

### public.interview_sessions
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `interview_sessions_delete_own` | delete | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260501010000_interview_sessions.sql:84` |
| `interview_sessions_insert_own` | insert | authenticated |  | `auth.uid() = user_id` | `supabase/migrations/20260501010000_interview_sessions.sql:69` |
| `interview_sessions_select_own` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260501010000_interview_sessions.sql:62` |
| `interview_sessions_update_own` | update | authenticated | `auth.uid() = user_id` | `auth.uid() = user_id` | `supabase/migrations/20260501010000_interview_sessions.sql:76` |

### public.ip_rate_limit
- RLS enabled: yes
- Policies: none observed in migrations

### public.ip_rate_limit_hits
- RLS enabled: yes
- Policies: none observed in migrations

### public.latency_aggregates
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `admin_read_latency_aggregates` | select | authenticated | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260518000000_latency_events.sql:99` |

### public.latency_events
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `admin_read_latency_events` | select | authenticated | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260518000000_latency_events.sql:66` |

### public.leaderboard_weekly
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `leaderboard_weekly_select_all` | select | authenticated | `true` |  | `supabase/migrations/20260429000000_leaderboard_weekly.sql:72` |
| `leaderboard_weekly_update_own` | update | authenticated | `user_id = auth.uid()` | `user_id = auth.uid()` | `supabase/migrations/20260429000000_leaderboard_weekly.sql:86` |
| `leaderboard_weekly_write_own` | insert | authenticated |  | `user_id = auth.uid()` | `supabase/migrations/20260429000000_leaderboard_weekly.sql:79` |

### public.learner_interaction_capture
- RLS enabled: yes
- Policies: none observed in migrations

### public.learning_data_consent
- RLS enabled: yes
- Policies: none observed in migrations

### public.learning_events
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `learning_events_insert_own` | insert | authenticated |  | `user_id = auth.uid()` | `supabase/migrations/20260708000000_learning_events.sql:44` |
| `learning_events_select_own` | select | authenticated | `user_id = auth.uid()` |  | `supabase/migrations/20260708000000_learning_events.sql:51` |

### public.lifetime_intent_signups
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `lifetime_intent_insert_own` | insert | authenticated |  | `auth.uid() = user_id` | `supabase/migrations/20260503010000_lifetime_intent.sql:57` |
| `lifetime_intent_select_own` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260503010000_lifetime_intent.sql:47` |

### public.listening_clips
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `listening_public_read` | select | public | `true` |  | `supabase/migrations/20260604000000_listening_library.sql:90` |

### public.login_attempts
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can view all login attempts` | select | public | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251120040607_4ff2005f-7d5c-4d11-a8c6-50222e51d0bb.sql:40` |
| `login_attempts_service_insert` | insert | service_role |  | `true` | `supabase/migrations/20260622000001_secdef_browser_write_wrappers.sql:171` |
| `Only admins view login attempts` | select | public | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251121110229_5a4831ee-e77e-460c-ab5d-d2904e1864b8.sql:46` |

### public.mercy_conversations
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `mercy_conversations_owner_delete` | delete | public | `auth.uid() = user_id` |  | `supabase/migrations/20260424040000_mercy_conversations.sql:72` |
| `mercy_conversations_owner_insert` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20260424040000_mercy_conversations.sql:61` |
| `mercy_conversations_owner_select` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20260424040000_mercy_conversations.sql:56` |
| `mercy_conversations_owner_update` | update | public | `auth.uid() = user_id` | `auth.uid() = user_id` | `supabase/migrations/20260424040000_mercy_conversations.sql:66` |

### public.mercy_feedback_daily_rollups
- RLS enabled: yes
- Policies: none observed in migrations

### public.mercy_feedback_events
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `mercy_feedback_events_anon_insert` | insert | anon |  | `true` | `supabase/migrations/20260718000000_mercy_feedback_events_anon_insert.sql:8` |
| `mercy_feedback_events_auth_insert` | insert | authenticated |  | `true` | `supabase/migrations/20260718000000_mercy_feedback_events_anon_insert.sql:14` |

### public.mercy_messages
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `mercy_messages_owner_delete` | delete | public | `EXISTS ( SELECT 1 FROM public.mercy_conversations c WHERE c.id = mercy_messages.conversation_id AND c.user_id = auth.uid() )` |  | `supabase/migrations/20260424040000_mercy_conversations.sql:98` |
| `mercy_messages_owner_insert` | insert | public |  | `EXISTS ( SELECT 1 FROM public.mercy_conversations c WHERE c.id = mercy_messages.conversation_id AND c.user_id = auth.uid() )` | `supabase/migrations/20260424040000_mercy_conversations.sql:89` |
| `mercy_messages_owner_select` | select | public | `EXISTS ( SELECT 1 FROM public.mercy_conversations c WHERE c.id = mercy_messages.conversation_id AND c.user_id = auth.uid() )` |  | `supabase/migrations/20260424040000_mercy_conversations.sql:80` |

### public.mercy_tts_usage
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `mercy_tts_usage_owner_read` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260511000000_elevenlabs_tts.sql:69` |

### public.mercy_unified_sessions
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `mercy_unified_sessions_select_own` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260605000000_mercy_unified_session.sql:44` |
| `mercy_unified_sessions_write_own` | all | authenticated | `auth.uid() = user_id` | `auth.uid() = user_id` | `supabase/migrations/20260605000000_mercy_unified_session.sql:52` |

### public.mercy_user_facts
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `mercy_user_facts_delete_own` | delete | authenticated | `user_id = auth.uid()` |  | `supabase/migrations/20260501000000_mercy_user_facts.sql:98` |
| `mercy_user_facts_insert_own` | insert | authenticated |  | `user_id = auth.uid()` | `supabase/migrations/20260501000000_mercy_user_facts.sql:83` |
| `mercy_user_facts_select_own` | select | authenticated | `user_id = auth.uid()` |  | `supabase/migrations/20260501000000_mercy_user_facts.sql:76` |
| `mercy_user_facts_update_own` | update | authenticated | `user_id = auth.uid()` | `user_id = auth.uid()` | `supabase/migrations/20260501000000_mercy_user_facts.sql:90` |

### public.mercy_worst_answers_daily
- RLS enabled: yes
- Policies: none observed in migrations

### public.metrics_history
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can view metrics history` | select | authenticated | `EXISTS ( SELECT 1 FROM public.user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin' )` |  | `supabase/migrations/20251125095700_971ab900-f95c-45f3-a0e8-a0a330d20fbc.sql:23` |
| `System can insert metrics snapshots` | insert | authenticated |  | `true` | `supabase/migrations/20251125095700_971ab900-f95c-45f3-a0e8-a0a330d20fbc.sql:36` |

### public.mfa_backup_codes
- RLS enabled: yes
- Policies: none observed in migrations

### public.mfa_lockouts
- RLS enabled: yes
- Policies: none observed in migrations

### public.mock_interview_sessions
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `mock_interview_sessions_owner_select` | select | public | `user_id = auth.uid()` |  | `supabase/migrations/20260519000000_mock_interview_rate_limit.sql:62` |

### public.path_days
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can manage path days` | all | public | `has_role(auth.uid(), 'admin'::app_role)` |  | `supabase/migrations/20251203124416_276daccd-2373-42d1-8ccb-2ab50223a8e5.sql:91` |
| `Admins can manage path_days` | all | public | `public.has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251203093516_01ee89eb-2b58-4784-98fa-87da776286fd.sql:61` |
| `Anyone can read path days` | select | public | `true` |  | `supabase/migrations/20251203124416_276daccd-2373-42d1-8ccb-2ab50223a8e5.sql:84` |
| `Anyone can read path_days` | select | public | `true` |  | `supabase/migrations/20251203093516_01ee89eb-2b58-4784-98fa-87da776286fd.sql:59` |

### public.paths
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can manage paths` | all | public | `has_role(auth.uid(), 'admin'::app_role)` |  | `supabase/migrations/20251203124416_276daccd-2373-42d1-8ccb-2ab50223a8e5.sql:74` |
| `Anyone can read paths` | select | public | `true` |  | `supabase/migrations/20251203124416_276daccd-2373-42d1-8ccb-2ab50223a8e5.sql:67` |

### public.payment_proof_audit_log
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can view audit logs` | select | authenticated | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251107030856_3e4aedc2-a9e3-4724-8f0c-bcf3246e78cf.sql:13` |
| `System can insert audit logs` | insert | authenticated |  | `auth.uid() = admin_user_id AND has_role(auth.uid(), 'admin')` | `supabase/migrations/20251107030856_3e4aedc2-a9e3-4724-8f0c-bcf3246e78cf.sql:20` |

### public.payment_proof_submissions
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can update all submissions` | update | public | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251022041903_3b6a51f5-fafd-49f2-a630-5cef5f09cad2.sql:42` |
| `Admins can view all submissions` | select | public | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251022041903_3b6a51f5-fafd-49f2-a630-5cef5f09cad2.sql:38` |
| `Users can insert their own submissions` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20251022041903_3b6a51f5-fafd-49f2-a630-5cef5f09cad2.sql:31` |
| `Users can view their own submissions` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20251022041903_3b6a51f5-fafd-49f2-a630-5cef5f09cad2.sql:34` |

### public.payment_transactions
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can view all transactions` | select | public | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251120035109_f953afb9-e33f-41ae-adae-246683979ab4.sql:48` |
| `payment_transactions_service_insert` | insert | service_role |  | `true` | `supabase/migrations/20260621000000_scope_legacy_public_policies.sql:55` |
| `prevent_transaction_deletion` | delete | authenticated | `false` |  | `supabase/migrations/20251201080440_051c8491-df9e-40ec-9454-7a25ca798a7d.sql:70` |
| `Users can view their own transactions` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20251120035109_f953afb9-e33f-41ae-adae-246683979ab4.sql:51` |

### public.paywall_experiment_exposures
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `paywall_exposures_insert_self` | insert | authenticated |  | `auth.uid() = user_id` | `supabase/migrations/20260503020000_paywall_experiments.sql:84` |
| `paywall_exposures_select_admin` | select | authenticated | `public.get_admin_level() >= 9` |  | `supabase/migrations/20260503020000_paywall_experiments.sql:92` |
| `paywall_exposures_update_admin` | update | authenticated | `public.get_admin_level() >= 9` | `public.get_admin_level() >= 9` | `supabase/migrations/20260503020000_paywall_experiments.sql:101` |
| `paywall_exposures_update_own_conversion` | update | authenticated | `auth.uid() = user_id` | `auth.uid() = user_id` | `supabase/migrations/20260503020000_paywall_experiments.sql:113` |

### public.perf_alert_history
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `admin_read_perf_alert_history` | select | authenticated | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260531000000_web_vitals_events.sql:118` |

### public.placement_item_exposure
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `plx_admin_sel` | select | authenticated | `public.get_admin_level() >= 9` |  | `supabase/migrations/20260619000000_placement_sessions.sql:171` |

### public.placement_items
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `placement_items_admin_read` | select | authenticated | `public.get_admin_level() >= 9` |  | `supabase/migrations/20260618000000_placement_items.sql:109` |

### public.placement_responses
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `plr_admin_sel` | select | authenticated | `public.get_admin_level() >= 9` |  | `supabase/migrations/20260619000000_placement_sessions.sql:165` |
| `plr_owner_ins` | insert | authenticated |  | `auth.uid() = user_id` | `supabase/migrations/20260619000000_placement_sessions.sql:161` |
| `plr_owner_sel` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260619000000_placement_sessions.sql:158` |

### public.placement_sessions
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `pls_admin_sel` | select | authenticated | `public.get_admin_level() >= 9` |  | `supabase/migrations/20260619000000_placement_sessions.sql:153` |
| `pls_owner_ins` | insert | authenticated |  | `auth.uid() = user_id` | `supabase/migrations/20260619000000_placement_sessions.sql:146` |
| `pls_owner_sel` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260619000000_placement_sessions.sql:143` |
| `pls_owner_upd` | update | authenticated | `auth.uid() = user_id` | `auth.uid() = user_id` | `supabase/migrations/20260619000000_placement_sessions.sql:149` |

### public.placement_v3_failure_timelines
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can read placement v3 failure timelines` | select | authenticated | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260520125321_placement_v3_forensics.sql:84` |

### public.placement_v3_forensic_events
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can read placement v3 forensic events` | select | authenticated | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260520125321_placement_v3_forensics.sql:78` |

### public.placement_v3_profiles
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `placement_v3_profiles_select_own` | select | authenticated | `user_id = auth.uid()` |  | `supabase/migrations/20260627000003_placement_v3_rls.sql:86` |

### public.placement_v3_responses
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `placement_v3_responses_insert_own_session` | insert | authenticated |  | `exists ( select 1 from public.placement_v3_sessions s where s.id = placement_v3_responses.session_id and s.user_id = auth.uid() )` | `supabase/migrations/20260627000003_placement_v3_rls.sql:71` |
| `placement_v3_responses_select_own_session` | select | authenticated | `exists ( select 1 from public.placement_v3_sessions s where s.id = placement_v3_responses.session_id and s.user_id = auth.uid() )` |  | `supabase/migrations/20260627000003_placement_v3_rls.sql:57` |

### public.placement_v3_runtime_alerts
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can read placement v3 runtime alerts` | select | authenticated | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260520125321_placement_v3_forensics.sql:90` |

### public.placement_v3_sessions
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `placement_v3_sessions_insert_own` | insert | authenticated |  | `user_id = auth.uid()` | `supabase/migrations/20260627000003_placement_v3_rls.sql:40` |
| `placement_v3_sessions_select_own` | select | authenticated | `user_id = auth.uid()` |  | `supabase/migrations/20260627000003_placement_v3_rls.sql:33` |
| `placement_v3_sessions_update_own` | update | authenticated | `user_id = auth.uid()` | `user_id = auth.uid()` | `supabase/migrations/20260627000003_placement_v3_rls.sql:47` |

### public.private_chat_requests
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Receivers can update request status` | update | authenticated | `auth.uid() = receiver_id` |  | `supabase/migrations/20251022212846_ebab8791-edfd-4336-9224-b245cdb6e5b0.sql:30` |
| `Users can create chat requests` | insert | authenticated |  | `auth.uid() = sender_id` | `supabase/migrations/20251022212846_ebab8791-edfd-4336-9224-b245cdb6e5b0.sql:16` |
| `Users can view their requests` | select | authenticated | `auth.uid() = sender_id OR auth.uid() = receiver_id` |  | `supabase/migrations/20251022212846_ebab8791-edfd-4336-9224-b245cdb6e5b0.sql:23` |

### public.private_messages
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Users can mark messages as read` | update | authenticated | `auth.uid() = receiver_id` |  | `supabase/migrations/20251022212846_ebab8791-edfd-4336-9224-b245cdb6e5b0.sql:65` |
| `Users can send messages` | insert | authenticated |  | `auth.uid() = sender_id` | `supabase/migrations/20251022212846_ebab8791-edfd-4336-9224-b245cdb6e5b0.sql:51` |
| `Users can view their approved messages` | select | public | `(auth.uid() = sender_id OR auth.uid() = receiver_id) AND EXISTS ( SELECT 1 FROM public.private_chat_requests WHERE public.private_chat_requests.id = public.private_messages.request_id AND public.private_chat_requests.status = 'accepted' AND ( public.private_chat_requests.sender_id = auth.uid() OR public.private_chat_requests.receiver_id = auth.uid() ) )` |  | `supabase/migrations/20251124083520_102a899d-9b3f-4eb9-83b9-eb285285c375.sql:75` |

### public.profiles
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `admins_view_all_profiles` | select | authenticated | `EXISTS ( SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin' )` |  | `supabase/migrations/20251102055649_bb3bee43-5506-4531-a5a0-c9b067ecf538.sql:13` |
| `deny_anonymous_profile_access` | all | anon | `false` |  | `supabase/migrations/20251201080440_051c8491-df9e-40ec-9454-7a25ca798a7d.sql:61` |
| `profiles_admin_can_select_all` | select | authenticated | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260425010000_admin_feature_flags_rls.sql:46` |
| `users_insert_own_profile` | insert | authenticated |  | `auth.uid() = id` | `supabase/migrations/20251102055649_bb3bee43-5506-4531-a5a0-c9b067ecf538.sql:66` |
| `users_update_own_profile` | update | authenticated | `auth.uid() = id` | `auth.uid() = id` | `supabase/migrations/20251102055649_bb3bee43-5506-4531-a5a0-c9b067ecf538.sql:59` |
| `users_view_own_profile` | select | authenticated | `auth.uid() = id` |  | `supabase/migrations/20251102055649_bb3bee43-5506-4531-a5a0-c9b067ecf538.sql:7` |

### public.promo_codes
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can manage promo codes` | all | public | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251021125101_fd597923-7a0c-4430-bcf7-33fb4d7057ee.sql:60` |
| `Authenticated users can validate entered codes` | select | authenticated | `is_active = true` |  | `supabase/migrations/20251021211018_8ca4f8d3-507a-474e-b6a6-48bd0621af40.sql:6` |

### public.pronunciation_challenges
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `pronunciation_challenges_select_all` | select | anon, authenticated | `true` |  | `supabase/migrations/20260607000000_pronunciation_challenges.sql:58` |

### public.pronunciation_srs_items
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Users delete own pronunciation SRS` | delete | authenticated | `user_id = auth.uid()` |  | `supabase/migrations/20260612000000_pronunciation_srs.sql:229` |
| `Users read own pronunciation SRS` | select | authenticated | `user_id = auth.uid()` |  | `supabase/migrations/20260612000000_pronunciation_srs.sql:210` |
| `Users update own pronunciation SRS` | update | authenticated | `user_id = auth.uid()` | `user_id = auth.uid()` | `supabase/migrations/20260612000000_pronunciation_srs.sql:222` |
| `Users write own pronunciation SRS` | insert | authenticated |  | `user_id = auth.uid()` | `supabase/migrations/20260612000000_pronunciation_srs.sql:216` |

### public.push_preferences
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `push_pref_owner_all` | all | authenticated | `user_id = auth.uid()` | `user_id = auth.uid()` | `supabase/migrations/20260527000000_push_notifications.sql:93` |

### public.push_send_log
- RLS enabled: yes
- Policies: none observed in migrations

### public.push_tokens
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `push_tokens_owner_read` | select | authenticated | `user_id = auth.uid()` |  | `supabase/migrations/20260527000000_push_notifications.sql:59` |

### public.rate_limit_config
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can manage rate limits` | all | public | `public.has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251122032324_114d7a5a-45ee-4604-a750-51b845944d2c.sql:49` |
| `Anyone can read rate limits` | select | public | `true` |  | `supabase/migrations/20251122032324_114d7a5a-45ee-4604-a750-51b845944d2c.sql:55` |

### public.rate_limits
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `System can manage rate limits` | all | authenticated | `true` | `true` | `supabase/migrations/20251129123534_ae3950bb-23cc-4538-ab61-158464eee077.sql:49` |
| `system_manage_rate_limits` | all | authenticated | `true` | `true` | `supabase/migrations/20251201080440_051c8491-df9e-40ec-9454-7a25ca798a7d.sql:159` |

### public.referral_audit_log
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `referral_audit_log_admin_read` | select | authenticated | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260524000000_referral_leaderboard.sql:107` |

### public.referral_codes
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `referral_codes_select_own` | select | authenticated | `auth.uid() = owner_user_id` |  | `supabase/migrations/20260712000000_referral_codes_owner_select.sql:7` |
| `referral_codes_write_own` | all | authenticated | `auth.uid() = owner_user_id` | `auth.uid() = owner_user_id` | `supabase/migrations/20260429010000_referrals.sql:62` |

### public.referral_leaderboard_all_time_public
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `referral_lb_all_time_public_read` | select | anon, authenticated | `true` |  | `supabase/migrations/20260629000000_safe_referral_leaderboard_projection.sql:89` |

### public.referral_leaderboard_monthly_public
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `referral_lb_monthly_public_read` | select | anon, authenticated | `true` |  | `supabase/migrations/20260629000000_safe_referral_leaderboard_projection.sql:81` |

### public.referral_leaderboard_optin
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `referral_lb_optin_admin_flag` | update | authenticated | `public.get_admin_level(auth.uid()) >= 9` | `public.get_admin_level(auth.uid()) >= 9` | `supabase/migrations/20260524000000_referral_leaderboard.sql:81` |
| `referral_lb_optin_select_own` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260524000000_referral_leaderboard.sql:63` |
| `referral_lb_optin_write_own` | all | authenticated | `auth.uid() = user_id` | `auth.uid() = user_id` | `supabase/migrations/20260524000000_referral_leaderboard.sql:70` |

### public.referral_uses
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `referral_uses_select_owner_or_referred` | select | authenticated | `auth.uid() = referred_user_id OR EXISTS ( SELECT 1 FROM public.referral_codes c WHERE c.code = referral_uses.code AND c.owner_user_id = auth.uid() )` |  | `supabase/migrations/20260429010000_referrals.sql:90` |

### public.responses
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Anonymous users can view demo room responses` | select | public | `auth.uid() IS NULL AND room_id IN ( SELECT id FROM public.rooms WHERE is_demo = true )` |  | `supabase/migrations/20251120041558_29383162-13c9-4976-a635-deb0dc8d5cf7.sql:24` |
| `Authenticated users can view all cached responses` | select | public | `auth.uid() IS NOT NULL` |  | `supabase/migrations/20251120041558_29383162-13c9-4976-a635-deb0dc8d5cf7.sql:20` |

### public.review_log
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `review_log_insert_own` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20260603000000_vocabulary_srs.sql:116` |
| `review_log_select_own` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20260603000000_vocabulary_srs.sql:110` |

### public.roadmap_item_votes
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `roadmap_item_votes_delete_self` | delete | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260505010000_voice_of_customer.sql:180` |
| `roadmap_item_votes_insert_self` | insert | authenticated |  | `auth.uid() = user_id` | `supabase/migrations/20260505010000_voice_of_customer.sql:173` |
| `roadmap_item_votes_select_own` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260713000000_roadmap_item_votes_owner_select.sql:7` |

### public.roadmap_items
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `roadmap_items_admin_all` | all | authenticated | `public.get_admin_level(auth.uid()) >= 9` | `public.get_admin_level(auth.uid()) >= 9` | `supabase/migrations/20260505010000_voice_of_customer.sql:156` |
| `roadmap_items_select_public` | select | authenticated | `public_visible = true` |  | `supabase/migrations/20260505010000_voice_of_customer.sql:147` |

### public.role_audit_log
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can view role audit logs` | select | authenticated | `public.has_role(auth.uid(), 'admin'::public.app_role)` |  | `supabase/migrations/20260301032412_v2_harden_roles_feedback.sql:205` |

### public.room_assignments
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Users can insert their room assignments` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20251021090532_d9d92b8c-20ac-460b-bc64-fc3915228985.sql:75` |
| `Users can view their room assignments` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20251021090532_d9d92b8c-20ac-460b-bc64-fc3915228985.sql:74` |

### public.room_entries
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can manage room entries` | all | public | `has_role(auth.uid(), 'admin'::app_role)` | `has_role(auth.uid(), 'admin'::app_role)` | `supabase/migrations/20251207122320_691891fd-1b01-4780-9939-091a1c768ba9.sql:45` |
| `room_entries_public_free_select` | select | public | `EXISTS ( SELECT 1 FROM rooms r WHERE r.id = room_entries.room_id AND COALESCE(r.required_vip_rank, 0) = 0 )` |  | `supabase/migrations/20260708000000_room_entries_live_select_policies.sql:9` |
| `room_entries_select_gated` | select | authenticated | `EXISTS ( SELECT 1 FROM rooms r WHERE r.id = room_entries.room_id AND ( COALESCE(r.required_vip_rank, 0) = 0 OR user_vip_rank(auth.uid()) >= COALESCE(r.required_vip_rank, 0) ) )` |  | `supabase/migrations/20260708000000_room_entries_live_select_policies.sql:23` |

### public.room_pins
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can manage room PINs` | all | public | `has_role(auth.uid(), 'admin'::app_role)` |  | `supabase/migrations/20251117114829_4d42c95e-7aaf-4d62-9298-5e0c0566f8cb.sql:16` |

### public.room_specification_assignments
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can manage specification assignments` | all | public | `public.has_role(auth.uid(), 'admin')` | `public.has_role(auth.uid(), 'admin')` | `supabase/migrations/20251128131351_0e37595f-5686-4fb8-9afb-fbf32548577b.sql:31` |
| `Anyone can view assignments` | select | public | `true` |  | `supabase/migrations/20251128131351_0e37595f-5686-4fb8-9afb-fbf32548577b.sql:43` |

### public.room_specifications
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can manage room specifications` | all | public | `public.has_role(auth.uid(), 'admin')` | `public.has_role(auth.uid(), 'admin')` | `supabase/migrations/20251128131351_0e37595f-5686-4fb8-9afb-fbf32548577b.sql:26` |
| `Anyone can view specifications` | select | public | `true` |  | `supabase/migrations/20251128131351_0e37595f-5686-4fb8-9afb-fbf32548577b.sql:39` |

### public.room_usage_analytics
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can view all analytics` | select | authenticated | `public.has_role(auth.uid(), 'admin'::app_role)` |  | `supabase/migrations/20251020100911_1cbf5f8d-d542-4a2a-b8fc-e608df44a947.sql:92` |
| `Users can insert their own analytics` | insert | authenticated |  | `auth.uid() = user_id` | `supabase/migrations/20251020100911_1cbf5f8d-d542-4a2a-b8fc-e608df44a947.sql:71` |
| `Users can update their own analytics` | update | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20251020100911_1cbf5f8d-d542-4a2a-b8fc-e608df44a947.sql:78` |
| `Users can view their own analytics` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20251020100911_1cbf5f8d-d542-4a2a-b8fc-e608df44a947.sql:85` |

### public.rooms
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can delete rooms` | delete | authenticated | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251108020558_e72277d6-66be-43c7-881a-f0ca524f9e4d.sql:21` |
| `Admins can insert rooms` | insert | authenticated |  | `has_role(auth.uid(), 'admin')` | `supabase/migrations/20251108020558_e72277d6-66be-43c7-881a-f0ca524f9e4d.sql:10` |
| `Admins can update rooms` | update | authenticated | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251108020558_e72277d6-66be-43c7-881a-f0ca524f9e4d.sql:15` |
| `admins_full_access_rooms` | all | authenticated | `has_role(auth.uid(), 'admin'::app_role)` | `has_role(auth.uid(), 'admin'::app_role)` | `supabase/migrations/20251201080440_051c8491-df9e-40ec-9454-7a25ca798a7d.sql:14` |
| `rooms_public_select` | select | public | `true` |  | `supabase/migrations/20260707000000_fix_content_rls_and_study_log_grant.sql:48` |
| `Users can view rooms based on tier` | select | authenticated | `public.has_role(auth.uid(), 'admin') OR public.get_user_tier_level(auth.uid()) >= public.get_room_tier_level(tier)` |  | `supabase/migrations/20251129094602_f8af8977-a2a3-4120-8705-c37e49d08c01.sql:43` |

### public.security_events
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can view all security events` | select | public | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251114224559_85cda284-a455-4dff-bcc3-1a6c9ee0c929.sql:22` |
| `security_events_service_insert` | insert | service_role |  | `true` | `supabase/migrations/20260621000000_scope_legacy_public_policies.sql:96` |

### public.security_incidents
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can update incidents` | update | public | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251122064525_f2cecb16-a0cd-4d6a-8dae-875394c3f1ef.sql:61` |
| `Admins can view incidents` | select | public | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251122064525_f2cecb16-a0cd-4d6a-8dae-875394c3f1ef.sql:57` |
| `security_incidents_service_insert` | insert | service_role |  | `true` | `supabase/migrations/20260621000000_scope_legacy_public_policies.sql:76` |

### public.security_monitoring_config
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can manage monitoring config` | all | public | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251122064525_f2cecb16-a0cd-4d6a-8dae-875394c3f1ef.sql:40` |

### public.sentry_crash_rate_snapshots
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `admin_read_sentry_snap` | select | authenticated | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260526000000_slo_incidents.sql:114` |

### public.slo_burn_alerts
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `admin_read_slo_burn_alerts` | select | authenticated | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260526000000_slo_incidents.sql:78` |

### public.slo_incidents
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `admin_read_slo_incidents` | select | authenticated | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260526000000_slo_incidents.sql:50` |

### public.speech_analysis_logs
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `speech_analysis_logs_select_own` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260506000000_speech_analysis_logs.sql:82` |

### public.speech_attempts
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `speech_attempts_admin_select` | select | authenticated | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260426000000_speech_attempts_persistence.sql:82` |
| `speech_attempts_insert_own` | insert | authenticated |  | `auth.uid() = user_id` | `supabase/migrations/20260321172500_speech_attempts.sql:69` |
| `speech_attempts_select_own` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260321172500_speech_attempts.sql:63` |
| `speech_attempts_service_role` | all | service_role | `true` | `true` | `supabase/migrations/20260321172500_speech_attempts.sql:77` |

### public.stripe_events
- RLS enabled: yes
- Policies: none observed in migrations

### public.stripe_webhook_events
- RLS enabled: yes
- Policies: none observed in migrations

### public.study_group_members
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `study_group_members_delete_self_or_owner` | delete | authenticated | `user_id = auth.uid() OR EXISTS ( SELECT 1 FROM public.study_groups g WHERE g.id = study_group_members.group_id AND g.owner_user_id = auth.uid() )` |  | `supabase/migrations/20260430000000_study_groups.sql:241` |
| `study_group_members_select` | select | authenticated | `EXISTS ( SELECT 1 FROM public.study_group_members me WHERE me.group_id = study_group_members.group_id AND me.user_id = auth.uid() ) OR EXISTS ( SELECT 1 FROM public.study_groups g WHERE g.id = study_group_members.group_id AND g.is_private = false )` |  | `supabase/migrations/20260430000000_study_groups.sql:217` |

### public.study_groups
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `study_groups_delete_owner` | delete | authenticated | `auth.uid() = owner_user_id` |  | `supabase/migrations/20260430000000_study_groups.sql:208` |
| `study_groups_insert_owner` | insert | authenticated |  | `auth.uid() = owner_user_id` | `supabase/migrations/20260430000000_study_groups.sql:193` |
| `study_groups_select` | select | authenticated | `is_private = false OR EXISTS ( SELECT 1 FROM public.study_group_members m WHERE m.group_id = study_groups.id AND m.user_id = auth.uid() )` |  | `supabase/migrations/20260430000000_study_groups.sql:178` |
| `study_groups_update_owner` | update | authenticated | `auth.uid() = owner_user_id` | `auth.uid() = owner_user_id` | `supabase/migrations/20260430000000_study_groups.sql:200` |

### public.study_log
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `study_log_own_insert` | insert | authenticated |  | `auth.uid() = user_id` | `supabase/migrations/20260707000000_fix_content_rls_and_study_log_grant.sql:82` |
| `study_log_own_select` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260707000000_fix_content_rls_and_study_log_grant.sql:76` |
| `study_log_own_update` | update | authenticated | `auth.uid() = user_id` | `auth.uid() = user_id` | `supabase/migrations/20260707000000_fix_content_rls_and_study_log_grant.sql:88` |

### public.subscription_tiers
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `admins_manage_tiers` | all | authenticated | `has_role(auth.uid(), 'admin'::app_role)` | `has_role(auth.uid(), 'admin'::app_role)` | `supabase/migrations/20251201080440_051c8491-df9e-40ec-9454-7a25ca798a7d.sql:51` |
| `authenticated_users_read_tiers` | select | authenticated | `is_active = true` |  | `supabase/migrations/20251201080440_051c8491-df9e-40ec-9454-7a25ca798a7d.sql:45` |

### public.subscription_usage
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can view all usage` | select | public | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251020094557_3ba06735-3135-46de-bb93-2f80c36b31ff.sql:96` |
| `Users can insert their own usage` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20251020094557_3ba06735-3135-46de-bb93-2f80c36b31ff.sql:80` |
| `Users can update their own usage` | update | public | `auth.uid() = user_id` |  | `supabase/migrations/20251020094557_3ba06735-3135-46de-bb93-2f80c36b31ff.sql:85` |
| `Users can view their own usage` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20251020094557_3ba06735-3135-46de-bb93-2f80c36b31ff.sql:76` |

### public.subscriptions
- RLS enabled: yes
- Policies: none observed in migrations

### public.system_logs
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can view all system logs` | select | public | `has_role(auth.uid(), 'admin'::app_role)` |  | `supabase/migrations/20251201050543_437009c0-246c-45b7-8f52-3bd571815cc6.sql:15` |
| `system_logs_service_insert` | insert | service_role |  | `true` | `supabase/migrations/20260622000001_secdef_browser_write_wrappers.sql:160` |

### public.teacher_feedback
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `admin_all_feedback` | all | public | `public.get_admin_level() >= 9` | `public.get_admin_level() >= 9` | `supabase/migrations/20260533000000_teacher_feedback.sql:173` |
| `teacher_insert_feedback` | insert | public |  | `public.get_admin_level() >= 5 and reviewer_id = auth.uid()` | `supabase/migrations/20260533000000_teacher_feedback.sql:152` |
| `teacher_select_own_feedback` | select | public | `public.get_admin_level() >= 5 and reviewer_id = auth.uid()` |  | `supabase/migrations/20260533000000_teacher_feedback.sql:163` |

### public.teacher_memory
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `teacher_memory_own_delete` | delete | public | `auth.uid() = user_id` |  | `supabase/migrations/20260423000000_teacher_memory_delete_policy.sql:8` |
| `teacher_memory_own_insert` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20260422001259_add_teacher_memory.sql:34` |
| `teacher_memory_own_read` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20260422001259_add_teacher_memory.sql:29` |
| `teacher_memory_own_update` | update | public | `auth.uid() = user_id` |  | `supabase/migrations/20260422001259_add_teacher_memory.sql:39` |

### public.testimonials
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admin can manage testimonials` | all | public | `EXISTS ( SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin' )` |  | `supabase/migrations/20251201045405_6ed1e585-6fed-4725-9668-70cfab027861.sql:37` |
| `Anyone can read testimonials` | select | public | `true` |  | `supabase/migrations/20251201045405_6ed1e585-6fed-4725-9668-70cfab027861.sql:33` |

### public.tts_usage_log
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `System can insert TTS usage logs` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20251112070827_94165dd1-6023-4afc-b019-3ed9c295f425.sql:21` |
| `Users can view their own TTS usage` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20251112070827_94165dd1-6023-4afc-b019-3ed9c295f425.sql:17` |

### public.ui_health_issues
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can manage UI health issues` | all | authenticated | `has_role(auth.uid(), 'admin'::app_role)` | `has_role(auth.uid(), 'admin'::app_role)` | `supabase/migrations/20251130072231_bb3437c1-2d23-43f7-9edb-53b539da14aa.sql:15` |
| `only_admins_manage_ui_health` | all | authenticated | `has_role(auth.uid(), 'admin'::app_role)` |  | `supabase/migrations/20251201080440_051c8491-df9e-40ec-9454-7a25ca798a7d.sql:169` |

### public.uptime_checks
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can view uptime checks` | select | public | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251122064525_f2cecb16-a0cd-4d6a-8dae-875394c3f1ef.sql:46` |
| `uptime_checks_service_insert` | insert | service_role |  | `true` | `supabase/migrations/20260621000000_scope_legacy_public_policies.sql:83` |

### public.user_challenge_completion
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `user_challenge_completion_insert_own` | insert | authenticated |  | `user_id = auth.uid()` | `supabase/migrations/20260607000000_pronunciation_challenges.sql:102` |
| `user_challenge_completion_select_own` | select | authenticated | `user_id = auth.uid()` |  | `supabase/migrations/20260607000000_pronunciation_challenges.sql:95` |
| `user_challenge_completion_update_own` | update | authenticated | `user_id = auth.uid()` | `user_id = auth.uid()` | `supabase/migrations/20260607000000_pronunciation_challenges.sql:109` |

### public.user_interview_prompt_votes
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `votes_delete_own` | delete | public | `auth.uid() = user_id` |  | `supabase/migrations/20260534000000_user_interview_prompts.sql:246` |
| `votes_insert_own` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20260534000000_user_interview_prompts.sql:240` |
| `votes_select_own` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260711000000_user_interview_prompt_votes_tighten_select.sql:40` |

### public.user_interview_prompts
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `admin_all` | all | public | `public.get_admin_level() >= 9` | `public.get_admin_level() >= 9` | `supabase/migrations/20260534000000_user_interview_prompts.sql:224` |
| `public_select_published` | select | public | `status = 'published'` |  | `supabase/migrations/20260534000000_user_interview_prompts.sql:188` |
| `submitter_delete_pending` | delete | public | `auth.uid() = submitter_user_id and status = 'pending'` |  | `supabase/migrations/20260534000000_user_interview_prompts.sql:214` |
| `submitter_insert_pending` | insert | public |  | `auth.uid() = submitter_user_id and status = 'pending'` | `supabase/migrations/20260534000000_user_interview_prompts.sql:203` |
| `submitter_select_own` | select | public | `auth.uid() = submitter_user_id` |  | `supabase/migrations/20260534000000_user_interview_prompts.sql:195` |

### public.user_listening_progress
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `listening_progress_owner` | all | public | `user_id = auth.uid()` | `user_id = auth.uid()` | `supabase/migrations/20260604000000_listening_library.sql:96` |

### public.user_moderation_status
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Only admins manage moderation` | all | public | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251121110229_5a4831ee-e77e-460c-ab5d-d2904e1864b8.sql:32` |
| `Users view own moderation status` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20251121110229_5a4831ee-e77e-460c-ab5d-d2904e1864b8.sql:36` |

### public.user_moderation_violations
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can view all violations` | select | public | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251021125101_fd597923-7a0c-4430-bcf7-33fb4d7057ee.sql:82` |
| `user_moderation_violations_service_insert` | insert | service_role |  | `true` | `supabase/migrations/20260621000000_scope_legacy_public_policies.sql:111` |
| `Users can view their own violations` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20251021125101_fd597923-7a0c-4430-bcf7-33fb4d7057ee.sql:79` |

### public.user_music_uploads
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can delete music uploads` | delete | authenticated | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251128132923_65345f28-0f57-430e-bb28-9f85403d6e10.sql:66` |
| `Admins can update music uploads` | update | authenticated | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251128132923_65345f28-0f57-430e-bb28-9f85403d6e10.sql:61` |
| `Admins can view all music uploads` | select | authenticated | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251128132923_65345f28-0f57-430e-bb28-9f85403d6e10.sql:56` |
| `Users can insert their own music uploads` | insert | authenticated |  | `auth.uid() = user_id` | `supabase/migrations/20251128132923_65345f28-0f57-430e-bb28-9f85403d6e10.sql:42` |
| `Users can view approved music` | select | authenticated | `upload_status = 'approved'` |  | `supabase/migrations/20251128132923_65345f28-0f57-430e-bb28-9f85403d6e10.sql:51` |
| `Users can view their own uploads` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20251128132923_65345f28-0f57-430e-bb28-9f85403d6e10.sql:46` |

### public.user_notebook_items
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `user_notebook_items_delete_own` | delete | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260420225840_add_notebook.sql:73` |
| `user_notebook_items_insert_own` | insert | authenticated |  | `auth.uid() = user_id` | `supabase/migrations/20260420225840_add_notebook.sql:60` |
| `user_notebook_items_select_own` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260420225840_add_notebook.sql:54` |
| `user_notebook_items_service_role` | all | service_role | `true` | `true` | `supabase/migrations/20260420225840_add_notebook.sql:79` |
| `user_notebook_items_update_own` | update | authenticated | `auth.uid() = user_id` | `auth.uid() = user_id` | `supabase/migrations/20260420225840_add_notebook.sql:66` |

### public.user_notes
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can manage all notes` | all | authenticated | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251120035750_1197441c-3bf3-4779-8c12-eb6d2fbc97a4.sql:17` |

### public.user_path_progress
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Users can delete own progress` | delete | public | `auth.uid() = user_id` |  | `supabase/migrations/20251203093516_01ee89eb-2b58-4784-98fa-87da776286fd.sql:74` |
| `Users can insert own progress` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20251203093516_01ee89eb-2b58-4784-98fa-87da776286fd.sql:68` |
| `Users can read own progress` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20251203093516_01ee89eb-2b58-4784-98fa-87da776286fd.sql:66` |
| `Users can update own progress` | update | public | `auth.uid() = user_id` |  | `supabase/migrations/20251203093516_01ee89eb-2b58-4784-98fa-87da776286fd.sql:71` |

### public.user_placements
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `user_placements_own_insert` | insert | authenticated |  | `auth.uid() = user_id` | `supabase/migrations/20260423120000_placement_test.sql:54` |
| `user_placements_own_select` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260423120000_placement_test.sql:47` |

### public.user_points
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `user_points_own_select` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260427005000_user_points_own_select_policy.sql:20` |
| `Users can update own points` | update | authenticated | `auth.uid() = user_id` | `auth.uid() = user_id` | `supabase/migrations/20251020130857_a7820a5f-2931-4cb0-8a8c-bce050181351.sql:103` |
| `Users can upsert own points` | insert | authenticated |  | `auth.uid() = user_id` | `supabase/migrations/20251020130857_a7820a5f-2931-4cb0-8a8c-bce050181351.sql:96` |
| `Users can view own points` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20251020130857_a7820a5f-2931-4cb0-8a8c-bce050181351.sql:89` |

### public.user_promo_redemptions
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can view all redemptions` | select | public | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251021125101_fd597923-7a0c-4430-bcf7-33fb4d7057ee.sql:73` |
| `Users can insert their own redemptions` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20251021125101_fd597923-7a0c-4430-bcf7-33fb4d7057ee.sql:69` |
| `Users can view their own redemptions` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20251021125101_fd597923-7a0c-4430-bcf7-33fb4d7057ee.sql:66` |

### public.user_quotas
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Users can insert their quotas` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20251021090532_d9d92b8c-20ac-460b-bc64-fc3915228985.sql:79` |
| `Users can update their quotas` | update | public | `auth.uid() = user_id` |  | `supabase/migrations/20251021090532_d9d92b8c-20ac-460b-bc64-fc3915228985.sql:80` |
| `Users can view their quotas` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20251021090532_d9d92b8c-20ac-460b-bc64-fc3915228985.sql:78` |

### public.user_referrals
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Users can create referrals` | insert | public |  | `referrer_user_id = auth.uid()` | `supabase/migrations/20251201045405_6ed1e585-6fed-4725-9668-70cfab027861.sql:53` |
| `Users can read their own referrals` | select | public | `referrer_user_id = auth.uid() OR referred_user_id = auth.uid()` |  | `supabase/migrations/20251201045405_6ed1e585-6fed-4725-9668-70cfab027861.sql:49` |

### public.user_roles
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can delete roles` | delete | authenticated | `public.has_role(auth.uid(), 'admin'::public.app_role)` |  | `supabase/migrations/20260301032412_v2_harden_roles_feedback.sql:136` |
| `Admins can grant roles to users` | insert | authenticated, for, insert, on, public.user_roles, to, users" |  | `public.has_role(auth.uid(), 'admin')` | `supabase/migrations/20251112055141_329dd075-0754-46dc-80a9-c17c5e2e593e.sql:5` |
| `Admins can insert roles` | insert | authenticated |  | `public.has_role(auth.uid(), 'admin'::public.app_role) and (created_by is null or created_by = auth.uid())` | `supabase/migrations/20260301032412_v2_harden_roles_feedback.sql:120` |
| `Admins can revoke roles from users` | delete | authenticated | `public.has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251112055141_329dd075-0754-46dc-80a9-c17c5e2e593e.sql:11` |
| `Admins can update roles` | update | authenticated | `public.has_role(auth.uid(), 'admin'::public.app_role)` | `public.has_role(auth.uid(), 'admin'::public.app_role)` | `supabase/migrations/20260301032412_v2_harden_roles_feedback.sql:129` |
| `Admins can view all roles` | select | authenticated | `public.has_role(auth.uid(), 'admin'::public.app_role)` |  | `supabase/migrations/20260301032412_v2_harden_roles_feedback.sql:112` |
| `only_admins_manage_roles` | all | authenticated | `has_role(auth.uid(), 'admin'::app_role)` | `has_role(auth.uid(), 'admin'::app_role)` | `supabase/migrations/20251201080440_051c8491-df9e-40ec-9454-7a25ca798a7d.sql:108` |
| `only_admins_read_roles` | select | authenticated | `auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role)` |  | `supabase/migrations/20251201080440_051c8491-df9e-40ec-9454-7a25ca798a7d.sql:99` |
| `Users can view their own roles` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260301032412_v2_harden_roles_feedback.sql:107` |

### public.user_room_progress
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `user_room_progress_own_delete` | delete | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260424000000_user_room_progress_writer_support.sql:59` |
| `user_room_progress_own_insert` | insert | authenticated |  | `auth.uid() = user_id` | `supabase/migrations/20260424000000_user_room_progress_writer_support.sql:46` |
| `user_room_progress_own_select` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260424000000_user_room_progress_writer_support.sql:40` |
| `user_room_progress_own_update` | update | authenticated | `auth.uid() = user_id` | `auth.uid() = user_id` | `supabase/migrations/20260424000000_user_room_progress_writer_support.sql:52` |

### public.user_security_status
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can manage security statuses` | all | public | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251120040607_4ff2005f-7d5c-4d11-a8c6-50222e51d0bb.sql:52` |
| `Admins can view all security statuses` | select | public | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251120040607_4ff2005f-7d5c-4d11-a8c6-50222e51d0bb.sql:49` |
| `Users can view their own security status` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20251120040607_4ff2005f-7d5c-4d11-a8c6-50222e51d0bb.sql:56` |

### public.user_sessions
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Users can delete own sessions` | delete | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20251113133808_f53a2487-65c0-4aa4-8248-b8fc4d567c7a.sql:40` |
| `Users can insert own sessions` | insert | authenticated |  | `auth.uid() = user_id` | `supabase/migrations/20251113133808_f53a2487-65c0-4aa4-8248-b8fc4d567c7a.sql:26` |
| `Users can update own sessions` | update | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20251113133808_f53a2487-65c0-4aa4-8248-b8fc4d567c7a.sql:33` |
| `Users can view own sessions` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20251113133808_f53a2487-65c0-4aa4-8248-b8fc4d567c7a.sql:19` |

### public.user_stories
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `admin_select` | select | authenticated | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260720010000_fix_user_stories_admin_policies.sql:7` |
| `admin_update` | update | authenticated | `public.get_admin_level(auth.uid()) >= 9` | `public.get_admin_level(auth.uid()) >= 9` | `supabase/migrations/20260720010000_fix_user_stories_admin_policies.sql:14` |
| `owner_delete_pending` | delete | public | `auth.uid() = user_id and status = 'pending'` |  | `supabase/migrations/20260523000000_user_stories.sql:129` |
| `owner_insert` | insert | public |  | `auth.uid() = user_id and status = 'pending'` | `supabase/migrations/20260523000000_user_stories.sql:110` |
| `owner_select` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20260523000000_user_stories.sql:96` |
| `owner_update_pending` | update | public | `auth.uid() = user_id and status in ('pending', 'published')` | `auth.uid() = user_id` | `supabase/migrations/20260523000000_user_stories.sql:120` |
| `public_select_published` | select | public | `status = 'published'` |  | `supabase/migrations/20260523000000_user_stories.sql:103` |

### public.user_submitted_sentences
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `user_sentences_insert_self` | insert | authenticated |  | `submitter_user_id = auth.uid() and status = 'pending' and reviewed_at is null and reviewed_by_user_id is null` | `supabase/migrations/20260425042419_user_sentences.sql:99` |
| `user_sentences_select_admin` | select | authenticated | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260425042419_user_sentences.sql:121` |
| `user_sentences_select_self` | select | authenticated | `submitter_user_id = auth.uid()` |  | `supabase/migrations/20260425042419_user_sentences.sql:111` |
| `user_sentences_update_admin` | update | authenticated | `public.get_admin_level(auth.uid()) >= 9` | `public.get_admin_level(auth.uid()) >= 9 and submitter_user_id is not distinct from submitter_user_id and en = en and vi = vi` | `supabase/migrations/20260425042419_user_sentences.sql:130` |

### public.user_subscription_state
- RLS enabled: yes
- Policies: none observed in migrations

### public.user_subscriptions
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can manage all subscriptions` | all | public | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251020094557_3ba06735-3135-46de-bb93-2f80c36b31ff.sql:92` |
| `admins_full_subscription_access` | all | authenticated | `has_role(auth.uid(), 'admin'::app_role)` | `has_role(auth.uid(), 'admin'::app_role)` | `supabase/migrations/20251201080440_051c8491-df9e-40ec-9454-7a25ca798a7d.sql:35` |
| `Users can create their own subscription` | insert | authenticated |  | `user_id = auth.uid()` | `supabase/migrations/20251207075419_9bb42f50-17c8-4208-8fd6-7905df438e8b.sql:19` |
| `users_select_own_subscription_only` | select | authenticated | `auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role)` |  | `supabase/migrations/20251201080440_051c8491-df9e-40ec-9454-7a25ca798a7d.sql:26` |

### public.user_tiers
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can manage all tiers` | all | public | `has_role(auth.uid(), 'admin'::app_role)` |  | `supabase/migrations/20251209000524_e50fdd6a-7d97-4ef9-92bb-e8208e9c218a.sql:23` |
| `Users can insert own tier` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20251209000524_e50fdd6a-7d97-4ef9-92bb-e8208e9c218a.sql:19` |
| `Users can update own tier` | update | public | `auth.uid() = user_id` |  | `supabase/migrations/20251209000524_e50fdd6a-7d97-4ef9-92bb-e8208e9c218a.sql:15` |
| `Users can view own tier` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20251209000524_e50fdd6a-7d97-4ef9-92bb-e8208e9c218a.sql:11` |

### public.user_vocabulary
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `user_vocabulary_delete_own` | delete | public | `auth.uid() = user_id` |  | `supabase/migrations/20260603000000_vocabulary_srs.sql:104` |
| `user_vocabulary_insert_own` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20260603000000_vocabulary_srs.sql:91` |
| `user_vocabulary_select_own` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20260603000000_vocabulary_srs.sql:85` |
| `user_vocabulary_update_own` | update | public | `auth.uid() = user_id` | `auth.uid() = user_id` | `supabase/migrations/20260603000000_vocabulary_srs.sql:97` |

### public.user_writing_submissions
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `user_writing_submissions_admin_all` | all | public | `public.get_admin_level() >= 9` | `public.get_admin_level() >= 9` | `supabase/migrations/20260606000000_writing_practice.sql:123` |
| `user_writing_submissions_delete_own` | delete | public | `auth.uid() = user_id` |  | `supabase/migrations/20260606000000_writing_practice.sql:117` |
| `user_writing_submissions_insert_own` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20260606000000_writing_practice.sql:111` |
| `user_writing_submissions_select_own` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20260606000000_writing_practice.sql:105` |

### public.user_xp
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `user_xp_insert_own` | insert | authenticated |  | `auth.uid() = user_id` | `supabase/migrations/20260424221000_xp_and_daily.sql:38` |
| `user_xp_select_own` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260424221000_xp_and_daily.sql:30` |
| `user_xp_update_own` | update | authenticated | `auth.uid() = user_id` | `auth.uid() = user_id` | `supabase/migrations/20260424221000_xp_and_daily.sql:46` |

### public.v4_curriculum_plans
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can read all curriculum plans` | select | public | `get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260521000004_v5_curriculum_plans.sql:43` |
| `Users can insert own curriculum plans` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20260521000004_v5_curriculum_plans.sql:35` |
| `Users can read own curriculum plans` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20260521000004_v5_curriculum_plans.sql:31` |
| `Users can update own curriculum plans` | update | public | `auth.uid() = user_id` |  | `supabase/migrations/20260521000004_v5_curriculum_plans.sql:39` |

### public.v4_learner_memory
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can read all learner memory` | select | public | `get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260520235959_v5_learner_memory.sql:42` |
| `Users can insert own learner memory` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20260520235959_v5_learner_memory.sql:34` |
| `Users can read own learner memory` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20260520235959_v5_learner_memory.sql:30` |
| `Users can update own learner memory` | update | public | `auth.uid() = user_id` |  | `supabase/migrations/20260520235959_v5_learner_memory.sql:38` |

### public.v4_orchestration_snapshots
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can read all orchestration snapshots` | select | public | `get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260521000002_v5_orchestration_snapshots.sql:45` |
| `Users can insert own orchestration snapshots` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20260521000002_v5_orchestration_snapshots.sql:37` |
| `Users can read own orchestration snapshots` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20260521000002_v5_orchestration_snapshots.sql:33` |
| `Users can update own orchestration snapshots` | update | public | `auth.uid() = user_id` |  | `supabase/migrations/20260521000002_v5_orchestration_snapshots.sql:41` |

### public.v4_provider_decisions
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can read all provider decisions` | select | public | `get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260521000003_v5_provider_decisions.sql:42` |
| `Users can read own provider decisions` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20260521000003_v5_provider_decisions.sql:38` |

### public.v4_telemetry_events
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can read all telemetry events` | select | public | `get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260521000001_v5_telemetry_events.sql:39` |
| `Users can insert own telemetry events` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20260521000001_v5_telemetry_events.sql:35` |
| `Users can read own telemetry events` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20260521000001_v5_telemetry_events.sql:31` |

### public.vip_room_requests
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can update all requests` | update | authenticated | `public.has_role(auth.uid(), 'admin'::app_role)` |  | `supabase/migrations/20251020100911_1cbf5f8d-d542-4a2a-b8fc-e608df44a947.sql:61` |
| `Admins can view all requests` | select | authenticated | `public.has_role(auth.uid(), 'admin'::app_role)` |  | `supabase/migrations/20251020100911_1cbf5f8d-d542-4a2a-b8fc-e608df44a947.sql:54` |
| `Level 1 users can create their own requests` | insert | authenticated |  | `auth.uid() = user_id` | `supabase/migrations/20251020100911_1cbf5f8d-d542-4a2a-b8fc-e608df44a947.sql:40` |
| `Users can view their own requests` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20251020100911_1cbf5f8d-d542-4a2a-b8fc-e608df44a947.sql:47` |

### public.vip_topic_requests_detailed
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can update all requests` | update | public | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251021125701_150802ce-a03e-48b4-9426-d00e47e10e36.sql:59` |
| `Admins can view all requests` | select | public | `has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251021125701_150802ce-a03e-48b4-9426-d00e47e10e36.sql:55` |
| `Users can insert their own requests` | insert | public |  | `auth.uid() = user_id` | `supabase/migrations/20251021125701_150802ce-a03e-48b4-9426-d00e47e10e36.sql:51` |
| `Users can view their own requests` | select | public | `auth.uid() = user_id` |  | `supabase/migrations/20251021125701_150802ce-a03e-48b4-9426-d00e47e10e36.sql:48` |

### public.vocabulary_srs_items
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Users delete own vocab SRS` | delete | authenticated | `user_id = auth.uid()` |  | `supabase/migrations/20260612000000_pronunciation_srs.sql:80` |
| `Users read own vocab SRS` | select | authenticated | `user_id = auth.uid()` |  | `supabase/migrations/20260612000000_pronunciation_srs.sql:61` |
| `Users update own vocab SRS` | update | authenticated | `user_id = auth.uid()` | `user_id = auth.uid()` | `supabase/migrations/20260612000000_pronunciation_srs.sql:73` |
| `Users write own vocab SRS` | insert | authenticated |  | `user_id = auth.uid()` | `supabase/migrations/20260612000000_pronunciation_srs.sql:67` |

### public.web_vitals_aggregates
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `admin_read_web_vitals_aggregates` | select | authenticated | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260531000000_web_vitals_events.sql:88` |

### public.web_vitals_events
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `admin_read_web_vitals` | select | authenticated | `public.get_admin_level(auth.uid()) >= 9` |  | `supabase/migrations/20260531000000_web_vitals_events.sql:54` |
| `anyone_can_insert_web_vitals` | insert | anon, authenticated |  | `true` | `supabase/migrations/20260531000000_web_vitals_events.sql:49` |

### public.weekly_digest_data
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `weekly_digest_data_public_read` | select | anon, authenticated | `true` |  | `supabase/migrations/20260517000000_weekly_digest_aggregates.sql:260` |

### public.weekly_leaderboard
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `weekly_leaderboard_select_own` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260510005000_weekly_leaderboard.sql:83` |
| `weekly_leaderboard_select_public_optin` | select | anon, authenticated | `display_name IS NOT NULL` |  | `supabase/migrations/20260510005000_weekly_leaderboard.sql:73` |
| `weekly_leaderboard_write_own` | all | authenticated | `auth.uid() = user_id` | `auth.uid() = user_id` | `supabase/migrations/20260510005000_weekly_leaderboard.sql:94` |

### public.writing_prompts
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `writing_prompts_admin_all` | all | public | `public.get_admin_level() >= 9` | `public.get_admin_level() >= 9` | `supabase/migrations/20260606000000_writing_practice.sql:94` |
| `writing_prompts_public_read` | select | public | `true` |  | `supabase/migrations/20260606000000_writing_practice.sql:88` |

### public.xp_events
- RLS enabled: yes

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `xp_events_select_own` | select | authenticated | `auth.uid() = user_id` |  | `supabase/migrations/20260609000000_xp_gamification.sql:87` |

### storage.objects
- RLS enabled: no

| Policy | Command | Roles | USING | WITH CHECK | Source |
|---|---|---|---|---|---|
| `Admins can delete user music` | delete | authenticated | `bucket_id = 'user-music' AND has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251128132923_65345f28-0f57-430e-bb28-9f85403d6e10.sql:115` |
| `Admins can view all bank payment screenshots` | select | public | `bucket_id = 'bank-payments' AND has_role(auth.uid(), 'admin'::app_role)` |  | `supabase/migrations/20251203221306_b25d93a0-9f3a-4064-83d3-77a10e4e0e45.sql:48` |
| `Admins can view all payment screenshots` | select | public | `bucket_id = 'payment-proofs' AND has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251022042015_1a4485ac-f103-4fb0-af94-1660036e6644.sql:21` |
| `Admins can view all user music` | select | authenticated | `bucket_id = 'user-music' AND has_role(auth.uid(), 'admin')` |  | `supabase/migrations/20251128132923_65345f28-0f57-430e-bb28-9f85403d6e10.sql:107` |
| `admins_view_all_payment_proofs` | select | authenticated | `bucket_id = 'payment-proofs' AND EXISTS ( SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin' )` |  | `supabase/migrations/20251102055649_bb3bee43-5506-4531-a5a0-c9b067ecf538.sql:82` |
| `Authenticated TTS can insert generated room audio` | insert | authenticated |  | `bucket_id = 'room-audio' AND auth.uid() IS NOT NULL AND name ~ '^[^/]+/[^/]+\.mp3$'` | `supabase/migrations/20260720000000_storage_room_audio_authenticated_cleanup.sql:13` |
| `Authenticated users can access room audio via signed URLs` | select | public | `bucket_id = 'room-audio' AND auth.role() = 'authenticated'` |  | `supabase/migrations/20251112070827_94165dd1-6023-4afc-b019-3ed9c295f425.sql:42` |
| `Avatar images are publicly accessible` | select | public | `bucket_id = 'avatars'` |  | `supabase/migrations/20251122024049_1d30f4b2-9931-4f76-bed2-cc92f92ffe4f.sql:10` |
| `mercy_tts_cache_public_read` | select | public | `bucket_id = 'mercy-tts-cache'` |  | `supabase/migrations/20260511000000_elevenlabs_tts.sql:40` |
| `Public read access for audio files` | select | public | `bucket_id = 'audio'` |  | `supabase/migrations/20251203144353_7353ddbe-fcee-4c62-8f11-f12cc622a93f.sql:6` |
| `Service role can delete audio files` | delete | service_role | `bucket_id = 'audio'` |  | `supabase/migrations/20260715000000_storage_audio_service_role_writes.sql:52` |
| `Service role can delete room audio uploads` | delete | service_role | `bucket_id = 'room-audio-uploads'` |  | `supabase/migrations/20260715000000_storage_audio_service_role_writes.sql:30` |
| `Service role can update audio files` | update | service_role | `bucket_id = 'audio'` | `bucket_id = 'audio'` | `supabase/migrations/20260715000000_storage_audio_service_role_writes.sql:44` |
| `Service role can upload audio files` | insert | service_role |  | `bucket_id = 'audio'` | `supabase/migrations/20260715000000_storage_audio_service_role_writes.sql:37` |
| `Service role can upload room audio` | insert | service_role |  | `bucket_id = 'room-audio'` | `supabase/migrations/20260715000000_storage_audio_service_role_writes.sql:16` |
| `Service role can upload room audio uploads` | insert | service_role |  | `bucket_id = 'room-audio-uploads'` | `supabase/migrations/20260715000000_storage_audio_service_role_writes.sql:23` |
| `share_cards_owner_delete` | delete | authenticated | `bucket_id = 'share-cards' AND auth.uid()::text = (storage.foldername(name))[1]` |  | `supabase/migrations/20260509010000_share_cards_bucket.sql:50` |
| `share_cards_owner_insert` | insert | authenticated |  | `bucket_id = 'share-cards' AND auth.uid()::text = (storage.foldername(name))[1]` | `supabase/migrations/20260509010000_share_cards_bucket.sql:39` |
| `share_cards_public_read` | select | public | `bucket_id = 'share-cards'` |  | `supabase/migrations/20260509010000_share_cards_bucket.sql:28` |
| `Users can delete their own avatar` | delete | public | `bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]` |  | `supabase/migrations/20251122024049_1d30f4b2-9931-4f76-bed2-cc92f92ffe4f.sql:27` |
| `Users can update their own avatar` | update | public | `bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]` |  | `supabase/migrations/20251122024049_1d30f4b2-9931-4f76-bed2-cc92f92ffe4f.sql:20` |
| `Users can upload bank payment screenshots` | insert | public |  | `bucket_id = 'bank-payments' AND auth.uid()::text = (storage.foldername(name))[1]` | `supabase/migrations/20251203221306_b25d93a0-9f3a-4064-83d3-77a10e4e0e45.sql:41` |
| `Users can upload their own avatar` | insert | public |  | `bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]` | `supabase/migrations/20251122024049_1d30f4b2-9931-4f76-bed2-cc92f92ffe4f.sql:13` |
| `Users can upload their own music` | insert | authenticated |  | `bucket_id = 'user-music' AND auth.uid()::text = (storage.foldername(name))[1]` | `supabase/migrations/20251128132923_65345f28-0f57-430e-bb28-9f85403d6e10.sql:92` |
| `Users can upload their payment screenshots` | insert | public |  | `bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]` | `supabase/migrations/20251022042015_1a4485ac-f103-4fb0-af94-1660036e6644.sql:5` |
| `Users can view own bank payment screenshots` | select | public | `bucket_id = 'bank-payments' AND auth.uid()::text = (storage.foldername(name))[1]` |  | `supabase/migrations/20251203221306_b25d93a0-9f3a-4064-83d3-77a10e4e0e45.sql:44` |
| `Users can view their own music` | select | authenticated | `bucket_id = 'user-music' AND auth.uid()::text = (storage.foldername(name))[1]` |  | `supabase/migrations/20251128132923_65345f28-0f57-430e-bb28-9f85403d6e10.sql:99` |
| `Users can view their own payment screenshots` | select | public | `bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]` |  | `supabase/migrations/20251022042015_1a4485ac-f103-4fb0-af94-1660036e6644.sql:13` |
| `users_delete_own_payment_proofs` | delete | authenticated | `bucket_id = 'payment-proofs' AND (auth.uid())::text = (storage.foldername(name))[1]` |  | `supabase/migrations/20251102055649_bb3bee43-5506-4531-a5a0-c9b067ecf538.sql:112` |
| `users_insert_own_payment_proofs` | insert | authenticated |  | `bucket_id = 'payment-proofs' AND (auth.uid())::text = (storage.foldername(name))[1]` | `supabase/migrations/20251102055649_bb3bee43-5506-4531-a5a0-c9b067ecf538.sql:94` |
| `users_update_own_payment_proofs` | update | authenticated | `bucket_id = 'payment-proofs' AND (auth.uid())::text = (storage.foldername(name))[1]` |  | `supabase/migrations/20251102055649_bb3bee43-5506-4531-a5a0-c9b067ecf538.sql:103` |
| `users_view_own_payment_proofs` | select | authenticated | `bucket_id = 'payment-proofs' AND (auth.uid())::text = (storage.foldername(name))[1]` |  | `supabase/migrations/20251102055649_bb3bee43-5506-4531-a5a0-c9b067ecf538.sql:73` |

