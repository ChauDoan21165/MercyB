
---

## SECURITY THREAT MODEL — Vietnamese state actors

Documented 2026-04-25. Refer back when:
- Onboarding any collaborator or hire
- Considering a security-related decision
- After any security incident
- During quarterly security review

### Threat actors of concern

1. **Vietnamese state cyber units (TC2, OceanLotus/APT32)**
   - Documented track record targeting dissidents abroad
   - Article 117 cases especially targeted
   - Have done SIM swaps, phishing, supply chain attacks
   - Goal: silence dissident voices, disrupt their economic ability

2. **Generic financially-motivated attackers**
   - Lower priority but still real
   - Phishing for credentials, ransomware, etc.

3. **Competitors**
   - Lowest probability but worth considering
   - Could try to scrape data, fake reviews, etc.

### Known TTPs (tactics, techniques, procedures)

1. **Phishing emails** — Fake "App Store / Google Play / Apple Developer"
   notices with malicious links
2. **SIM swap attacks** — Phone-based account takeover via mobile carrier
   social engineering
3. **Supply chain** — Compromised npm packages, fake update emails
4. **Account takeover** — Trying leaked passwords from data breaches
5. **Domain hijacking** — Targeting registrars to redirect domain
6. **Browser extensions** — Malicious "helper" extensions that log sessions
7. **Compromised review notifications** — Fake Stripe/Apple notifications
8. **Social engineering against diaspora users** — Pretending to be MercyBlade
   support to phish user credentials

### Defense layers (5 layers)

#### Layer 1 — Personal account security (FREE-$200, do this month)

Goal: protect founder credentials. If they get into Chau's accounts,
the app dies.

P0 ACTIONS:
- [ ] Buy 2 YubiKeys ($50-100 each — yubico.com YubiKey 5 NFC)
- [ ] Register YubiKey on: Google account, GitHub, Apple ID, Supabase,
      Stripe, ElevenLabs, OpenAI, Anthropic
- [ ] Disable SMS 2FA on EVERY important account (use TOTP authenticator
      app or hardware key only — SMS 2FA is breakable via SIM swap)
- [ ] Use password manager (Bitwarden free or 1Password)
- [ ] Verify FileVault enabled on Mac (System Settings → Privacy)
- [ ] Separate identities: personal email ≠ MercyBlade founder email
      ≠ banking email

ESTIMATED TIME: 2-3 hours of human dashboard work

#### Layer 2 — App security (FREE-LOW cost, do this week)

P0 ACTIONS:
- [ ] Rotate ALL API keys ever exposed (ElevenLabs, OpenAI, Anthropic,
      Stripe, Supabase service role)
- [ ] Lock down Supabase service role access
- [ ] Enable GitHub: branch protection, Dependabot, secret scanning
- [ ] Make GitHub repo PRIVATE if not already
- [ ] Domain registrar lock (where mercyblade.com is registered)
- [ ] DMARC/SPF/DKIM email setup (free with Cloudflare)

ESTIMATED TIME: 2-4 hours

#### Layer 3 — Code & infrastructure (ongoing)

ACTIONS (some done, some pending):
- [x] Rate limiting on public API (Round 12 #114)
- [x] RLS on most tables (verify all tables in audit)
- [ ] Audit dependencies via npm audit + Dependabot
- [ ] Edge function auth verification (every function requires JWT)
- [ ] CSP headers on hosting
- [ ] Sentry runtime error monitoring (was already TODO)
- [ ] Cost dashboards monitoring (sudden spikes = compromise sign)

ESTIMATED TIME: 4-6 hours

#### Layer 4 — User account protection

User-facing defenses:
- [x] Don't store political content (MercyBlade is language learning)
- [x] Pseudonymous accounts (email + username, no real name required)
- [ ] One-click delete-everything button (GDPR-style hard delete)
- [ ] Use opaque user IDs in URLs (not enumerable integers)
- [x] Encrypted backups (Supabase default — verify)

ESTIMATED TIME: 2-3 hours

#### Layer 5 — Operational security (ongoing mindset)

GUIDELINES (no checkboxes — these are practices, not tasks):
- Don't talk publicly about specific defenses (free reconnaissance)
- Be paranoid about emails/calls claiming to be from Apple/Google/Stripe
- Don't post work schedule, location, or photos with metadata publicly
- Always navigate to official sites directly, never click email links
- Backups across jurisdictions (GitHub US, Supabase region X, local
  encrypted backup)
- Have a "burned" recovery plan written down once

### What NOT to do

1. **Don't roll custom encryption** — bug factories. Trust at-rest defaults.
2. **Don't roll custom auth** — Supabase auth is professionally audited.
3. **Don't be paranoid in founder voice** — exiled-journalist identity is
   the moat; don't morph into "anxious security obsessive."
4. **Don't tell users about specific defenses** — those are attacker
   targets. Generic "we take security seriously" is fine; specifics aren't.

### Cost-prioritized action list

| Priority | Action | Cost | Time | Status |
|---|---|---|---|---|
| P0 | 2 YubiKeys + register everywhere | $100-200 | 2 hrs | ⏳ |
| P0 | Disable SMS 2FA, switch to TOTP/hardware | Free | 1 hr | ⏳ |
| P0 | Rotate any API keys ever exposed | Free | 1 hr | ⏳ |
| P0 | FileVault verify on Mac | Free | 5 min | ⏳ |
| P0 | Domain registrar lock | Free | 15 min | ⏳ |
| P1 | Dependabot + secret scanning on GitHub | Free | 30 min | ⏳ |
| P1 | RLS audit on all Supabase tables | Free | 2 hrs | ⏳ |
| P1 | Sentry runtime monitoring setup | Free tier | 1 hr | ⏳ |
| P2 | DMARC/SPF/DKIM email setup | Free | 1 hr | ⏳ |
| P2 | CSP headers | Free | 30 min | ⏳ |
| P2 | Bitwarden password manager migration | Free | 4 hrs | ⏳ |
| P3 | Quarterly security audit calendar reminder | Free | 2 hrs | ⏳ |

TOTAL: ~16 hours over 2-3 weeks. Most important: P0 first.

### Specific defenses against VN state TTPs

| TTP | Defense |
|---|---|
| Phishing emails | YubiKey on every account (defeats most phishing) |
| SIM swap | Disable SMS 2FA, hardware key only |
| Supply chain | Dependabot + skepticism about new packages |
| Account takeover | Unique passwords + 2FA via password manager |
| Domain hijacking | Registrar lock + dedicated domain email |
| Browser extensions | Don't install random extensions |
| Compromised notifications | Always go to provider site directly |
| Social engineering against users | Verify identity before account discussions |

### What attackers can't easily defeat

- Hardware key 2FA (FIDO2) — physical possession required
- Properly configured RLS in Postgres
- Domain registrar lock + DMARC
- Code reviews on every PR
- Encrypted backups in multiple jurisdictions

### Recovery playbook (if compromised)

If MercyBlade gets hacked:

1. **Don't panic publicly.** Quiet investigation first.
2. **Rotate all credentials immediately.**
3. **Restore from clean backup if data was tampered.**
4. **Communicate with users factually:**
   - What happened
   - What data was affected
   - What we did to fix
   - What they should do (e.g. password reset)
   - Don't blame specific actors unless 100% confirmed
5. **Calm forward-looking tone.** No panic.

### When to revisit this section

- Quarterly review (every 3 months)
- After any security incident
- After major news of state-actor cyber attacks on diaspora
- Before adding any new third-party service
- Before sharing any credential with a collaborator or hire

### Honest perspective

MercyBlade is a solo-founder operation. Cannot have a SOC team. Cannot
run penetration tests monthly. The goal isn't perfect security — it's
**good enough that the attacker would rather target someone easier.**

Most successful attacks on diaspora businesses use:
- Generic phishing → hardware key defeats
- Account takeover from leaks → unique passwords + 2FA defeat
- Subdomain hijacking → registrar lock defeats
- Supply chain → Dependabot + caution defeat

Targeted state-actor attacks (custom 0-days, professional intrusion)
are rare even for high-value targets. Language app is lower priority
than active news sites. Defense for those: backups in multiple places,
ability to rebuild from scratch.

### Status as of 2026-04-25

- 0 of 12 priority actions completed
- Threat model documented
- Code-side audit pending (3 agent tasks below)

