import { expect, test } from "@playwright/test";

const fixtureHtml = `
  <main data-testid="placement-forensics-dashboard">
    <h1>Placement V3 Forensics</h1>
    <section aria-label="summary">
      <article><h2>Failed sessions</h2><strong>3</strong></article>
      <article><h2>Degraded sessions</h2><strong>2</strong></article>
      <article><h2>Retries</h2><strong>4</strong></article>
      <article><h2>Provider switches</h2><strong>1</strong></article>
      <article><h2>Latency spikes</h2><strong>2</strong></article>
      <article><h2>Orchestration dead ends</h2><strong>1</strong></article>
      <article><h2>Taxonomy anomalies</h2><strong>1</strong></article>
      <article><h2>Unrecoverable failures</h2><strong>1</strong></article>
    </section>
    <section aria-label="runtime-alerts">
      <h2>Runtime Alerts</h2>
      <article data-severity="fatal">FATAL · unrecoverable_failure · insertResponse failed</article>
      <article data-severity="warn">WARN · latency_spike · grader exceeded 12000ms</article>
    </section>
    <section aria-label="failure-timelines">
      <h2>Failure Timelines</h2>
      <input aria-label="Filter timelines" />
      <article data-session="session-provider-timeout">
        <h3>session-provider-timeout</h3>
        <p>recoverability: degraded_safe</p>
        <p>degraded: yes</p>
        <ol>
          <li>1. request.received · session_event</li>
          <li>2. grader.writing · provider_event</li>
          <li>3. grader.writing.fallback · degraded_result</li>
        </ol>
      </article>
      <article data-session="session-persistence-write-failure">
        <h3>session-persistence-write-failure</h3>
        <p>recoverability: unrecoverable</p>
        <p>missing sequences: 2</p>
      </article>
      <article data-session="session-taxonomy-parse-failure">
        <h3>session-taxonomy-parse-failure</h3>
        <p>taxonomy_trigger · parse_failed</p>
      </article>
    </section>
  </main>
`;

test.describe("Placement forensics dashboard operator flows", () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(fixtureHtml);
  });

  test("operator can see the forensic dashboard shell", async ({ page }) => {
    await expect(page.getByTestId("placement-forensics-dashboard")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Placement V3 Forensics" })).toBeVisible();
  });

  test("operator can identify failed and degraded session counts", async ({ page }) => {
    await expect(page.getByText("Failed sessions")).toBeVisible();
    await expect(page.getByText("Degraded sessions")).toBeVisible();
  });

  test("operator can identify retry and provider-switch pressure", async ({ page }) => {
    await expect(page.getByText("Retries")).toBeVisible();
    await expect(page.getByText("Provider switches")).toBeVisible();
  });

  test("operator can identify latency spikes and orchestration dead ends", async ({ page }) => {
    await expect(page.getByText("Latency spikes")).toBeVisible();
    await expect(page.getByText("Orchestration dead ends")).toBeVisible();
  });

  test("operator can inspect runtime alerts", async ({ page }) => {
    await expect(page.getByLabel("runtime-alerts")).toContainText("unrecoverable_failure");
    await expect(page.getByLabel("runtime-alerts")).toContainText("latency_spike");
  });

  test("operator can distinguish recoverable degraded and unrecoverable sessions", async ({ page }) => {
    await expect(page.locator('[data-session="session-provider-timeout"]')).toContainText("degraded_safe");
    await expect(page.locator('[data-session="session-persistence-write-failure"]')).toContainText("unrecoverable");
  });

  test("operator can spot missing event sequence evidence", async ({ page }) => {
    await expect(page.locator('[data-session="session-persistence-write-failure"]')).toContainText("missing sequences");
  });

  test("operator can spot taxonomy-trigger anomalies", async ({ page }) => {
    await expect(page.locator('[data-session="session-taxonomy-parse-failure"]')).toContainText("taxonomy_trigger");
    await expect(page.locator('[data-session="session-taxonomy-parse-failure"]')).toContainText("parse_failed");
  });
});
