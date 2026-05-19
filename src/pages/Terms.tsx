// File: src/pages/Terms.tsx

import SeoMeta from "@/components/seo/SeoMeta";

export default function Terms() {
  return (
    <div style={{ padding: 24, maxWidth: 860, margin: "0 auto", lineHeight: 1.6 }}>
      <SeoMeta
        title="Điều khoản sử dụng — MercyBlade"
        description="Điều khoản sử dụng (EULA) của MercyBlade — quyền và trách nhiệm khi dùng ứng dụng học ngoại ngữ cho người Việt."
        canonical="https://mercyblade.com/terms"
      />
      <h1>Terms of Use (EULA)</h1>

      <p>
        <strong>Last updated:</strong> April 22, 2026
      </p>

      <p>
        These Terms of Use ("Terms") govern your access to and use of the Mercy
        Blade website, mobile app, and related services ("Mercy Blade",
        "Service"). By creating an account, subscribing, or using the Service,
        you agree to these Terms. If you do not agree, do not use the Service.
      </p>

      <h2>1. Accounts</h2>
      <p>
        You must provide accurate information when creating an account. You are
        responsible for keeping your login credentials safe and for all activity
        that happens under your account.
      </p>

      <h2>2. Subscriptions and Payments</h2>
      <p>
        Mercy Blade offers auto-renewing subscriptions. Each subscription has a
        title, length, and price shown in the app before purchase. Subscriptions
        automatically renew at the end of each billing period at the same price
        unless you cancel at least 24 hours before the renewal date.
      </p>
      <p>
        On iOS, subscriptions are billed to your Apple ID and managed in your
        Apple account settings. You can cancel or manage your subscription there
        at any time. On the web, subscriptions are managed via the billing
        portal inside the app.
      </p>

      <h2>3. Free Trials</h2>
      <p>
        If we offer a free trial, the subscription begins at the end of the
        trial unless you cancel before the trial ends.
      </p>

      <h2>4. Refunds</h2>
      <p>
        Refunds are handled by the original payment provider. For purchases
        made through Apple, refund requests go through Apple. For purchases
        made through Stripe on the web, contact admin@mercyblade.com.
      </p>

      <h2>5. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Service for anything unlawful.</li>
        <li>Try to reverse engineer, resell, or sublicense the Service.</li>
        <li>Abuse, harass, or harm other users or Mercy Blade staff.</li>
        <li>Attempt to disrupt or compromise our systems.</li>
      </ul>

      <h2>6. Content and Intellectual Property</h2>
      <p>
        Mercy Blade and its content, including text, audio, images, and code,
        are owned by Mercy Blade or its licensors and are protected by
        intellectual property laws. You receive a limited, non-exclusive,
        non-transferable license to use the Service for personal, non-commercial
        learning.
      </p>

      <h2>7. Account Deletion</h2>
      <p>
        You can delete your account from inside the app at any time under
        Account → Delete my account. When you delete your account, your
        personal data is removed as described in our Privacy Policy.
      </p>

      <h2>8. Termination</h2>
      <p>
        We may suspend or terminate your account if you violate these Terms or
        if required by law. You may stop using the Service at any time.
      </p>

      <h2>9. Disclaimers</h2>
      <p>
        The Service is provided "as is" without warranties of any kind. We do
        not guarantee any specific learning outcome, exam score, or job result.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Mercy Blade is not liable for
        any indirect, incidental, special, consequential, or punitive damages
        arising out of your use of the Service.
      </p>

      <h2>11. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. When we do, we will post
        the updated version on this page and update the effective date.
      </p>

      <h2>12. Contact</h2>
      <p>
        If you have questions about these Terms, contact us at:
      </p>
      <p>
        <strong>admin@mercyblade.com</strong>
      </p>
    </div>
  );
}
