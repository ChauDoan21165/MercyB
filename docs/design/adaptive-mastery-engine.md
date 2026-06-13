# Adaptive Mastery Engine V1

V1 builds a pure next-item engine: it derives stable skills from the theme/item catalog, updates per-skill mastery with Bayesian knowledge tracing, schedules review cards through `ts-fsrs`, and ranks the next practice items.

Parameter tuning is post-data. The initial constants are deliberately conservative until real learner histories exist.

Done when simulated learner history can produce ranked next items that mix review-due work, weak-skill repair, and default-path fallback with stable reason codes.
