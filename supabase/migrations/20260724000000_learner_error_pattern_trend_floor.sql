alter table public.learner_error_patterns
  drop constraint if exists learner_error_patterns_trend_chk;

alter table public.learner_error_patterns
  add constraint learner_error_patterns_trend_chk
  check (trend in ('insufficient', 'improving', 'stable', 'worsening'));
