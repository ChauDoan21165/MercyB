import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      mode,
      taskIntent,
      language,
      input,
      payload,
      systemPrompt,
      taskInstruction,
    } = req.body;

    if (mode !== 'guide_tutor') {
      return res.status(400).json({ error: 'Invalid mode' });
    }

    if (!taskIntent || !payload) {
      return res.status(400).json({ error: 'Missing taskIntent or payload' });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing OPENAI_API_KEY' });
    }

    const userPrompt = `
Language: ${language}
Task: ${taskIntent}

User request:
${input}

Text:
${payload}
`;

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-5-mini',
        input: [
          {
            role: 'system',
            content: [
              {
                type: 'input_text',
                text: `${systemPrompt}\n\n${taskInstruction}`,
              },
            ],
          },
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: userPrompt,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    const reply =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      '';

    return res.status(200).json({
      reply: reply.trim(),
      suggestSpeak: false,
      confidence: 0.8,
      taskIntent,
    });
  } catch (err: any) {
    return res.status(500).json({
      error: err.message || 'Server error',
    });
  }
}