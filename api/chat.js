export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, context } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const systemPrompt = `You are a Hong Kong property compliance management assistant (物业合规管理助手).
You help property managers track and manage their regulatory compliance obligations.

IMPORTANT RULES:
- Respond in Chinese (the same style the user uses — mix of simplified/traditional is fine for HK context)
- Be conversational and natural, like a helpful colleague, NOT robotic
- Always end with 1-3 specific actionable next steps using "→" arrows
- Keep responses concise — no more than 200 words
- When discussing items, mention specific property names, vendor names, dates
- If something is overdue, be direct about urgency and consequences
- Reference specific HK ordinances (Cap.95, Cap.123, Cap.344, etc.) when relevant

Here is the current compliance data for the user's properties:
${context || "No data available."}

Answer the user's question based on this data. If the question is unrelated to property compliance, still try to be helpful but gently steer back to compliance topics.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: message }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("Anthropic API error:", err);
      return res.status(502).json({ error: "AI service error" });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || "抱歉，无法生成回复。";
    return res.status(200).json({ reply: text });
  } catch (err) {
    console.error("API call failed:", err);
    return res.status(500).json({ error: "Failed to reach AI service" });
  }
}
