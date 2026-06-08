import {
  envValue,
  json,
  optionsResponse,
  readJsonBody,
  type NetlifyEvent,
} from "./_shared/http";

type MercyGuideBody = {
  mode?: string;
  taskIntent?: string;
  language?: string;
  input?: string;
  payload?: unknown;
  systemPrompt?: string;
  taskInstruction?: string;
};

export async function handler(event: NetlifyEvent) {
  if (event.httpMethod === "OPTIONS") return optionsResponse();
  if (event.httpMethod !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = readJsonBody<MercyGuideBody>(event);
    const { mode, taskIntent, language, input, payload, systemPrompt, taskInstruction } = body;

    if (mode !== "guide_tutor") return json({ error: "Invalid mode" }, 400);
    if (!taskIntent || !payload) return json({ error: "Missing taskIntent or payload" }, 400);

    const apiKey = envValue("OPENAI_API_KEY");
    if (!apiKey) return json({ error: "Missing OPENAI_API_KEY" }, 500);

    const userPrompt = `
Language: ${language}
Task: ${taskIntent}

User request:
${input}

Text:
${typeof payload === "string" ? payload : JSON.stringify(payload)}
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        input: [
          {
            role: "system",
            content: [{ type: "input_text", text: `${systemPrompt ?? ""}\n\n${taskInstruction ?? ""}` }],
          },
          {
            role: "user",
            content: [{ type: "input_text", text: userPrompt }],
          },
        ],
      }),
    });

    if (!response.ok) return json({ error: `OpenAI ${response.status}` }, 502);
    const data = await response.json() as {
      output_text?: string;
      output?: Array<{ content?: Array<{ text?: string }> }>;
    };
    const reply = data.output_text || data.output?.[0]?.content?.[0]?.text || "";
    return json({ reply: reply.trim(), suggestSpeak: false, confidence: 0.8, taskIntent });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Server error" }, 500);
  }
}
