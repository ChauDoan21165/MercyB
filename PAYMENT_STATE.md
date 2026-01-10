# PAYMENT STATE — Mercy Blade

Date: 2026-01-03

## What WORKS
- Stripe Checkout via Supabase Edge Function
- JWT required
- Prices: VIP1 / VIP3 / VIP9 (monthly)
- payment_transactions inserted with status = pending
- ESLint + build clean

## What is NOT done yet
- Stripe webhook handling
- Tier upgrade after payment
- Subscription cancel / downgrade

## Next exact step
Implement Stripe webhook:
- checkout.session.completed
- invoice.paid
- subscription.updated / deleted
