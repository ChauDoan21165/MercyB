import { expect, test } from "vitest";

import { run, runCheck, scanAsyncUiStateNoTerminalFailureFromText } from "../hardening-scan.mjs";

test("v4 scanner flags async UI request state with no terminal failure state", () => {
  const source = `
    function BrokenPanel() {
      const [loading, setLoading] = useState(false);
      const send = async () => {
        setLoading(true);
        const response = await fetch("/api/mercy-ai");
        setAnswer(await response.text());
      };
      return <button onClick={send}>Send</button>;
    }
  `;

  const hits = scanAsyncUiStateNoTerminalFailureFromText(source, "src/components/ai-tutor/BrokenPanel.tsx");

  expect(hits).toHaveLength(1);
  expect(hits[0].line).toBe(5);
});

test("v4 scanner accepts bounded async UI state with distinct failure and retry", () => {
  const source = `
    function HardenedPanel() {
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState("");
      const retry = () => void send();
      const send = async () => {
        setLoading(true);
        setError("");
        try {
          const response = await fetchWithTimeout("/api/mercy-ai", {}, 12_000);
          setAnswer(await response.text());
        } catch {
          setError("Mercy chưa lấy được câu trả lời. Bạn thử lại nhé.");
        } finally {
          setLoading(false);
        }
      };
      return error ? <button onClick={retry}>Thử lại</button> : null;
    }
  `;

  const hits = scanAsyncUiStateNoTerminalFailureFromText(source, "src/components/ai-tutor/HardenedPanel.tsx");

  expect(hits).toEqual([]);
});

test("scanner command runner reports timeouts with code 124", () => {
  const result = run(process.execPath, ["-e", "setTimeout(() => {}, 1000)"], { timeoutMs: 10 });

  expect(result.timedOut).toBe(true);
  expect(result.code).toBe(124);
  expect(result.timeoutMs).toBe(10);
});

test("scanner check wrapper records elapsed time and timeout budget", () => {
  const result = runCheck("Z", "fixture check", () => ({ status: "ok", findings: [] }));

  expect(result.status).toBe("ok");
  expect(result.findings).toEqual([]);
  expect(typeof result.elapsedMs).toBe("number");
  expect(result.timeoutMs).toBe(60_000);
});
