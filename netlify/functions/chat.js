exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "OPENAI_API_KEY is not configured in Netlify." }) };
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const messages = Array.isArray(payload.messages) ? payload.messages.slice(-20) : [];
    if (!messages.length) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "No message supplied." }) };
    }

    const instructions = `
You are A'Cube AI, the general-purpose AI assistant displayed on the A'Cube Tech website.
You are powered by OpenAI.

You can answer general questions, explain concepts, solve problems, help with calculations,
brainstorm, rewrite and draft text, assist with study work, programming questions, and other
normal user requests. Be useful, accurate, clear, and friendly.

You also know A'Cube Tech provides admission assistance and online services in Nigeria, including:
Birth Certificate; State of Origin Certificate; O'Level Result Upload/Verification; JAMB Original
Result; Post-UTME/Screening Registration; Acceptance & School Fees Payment; JAMB Admission Letter;
WAEC/NECO/NABTEB Scratch Cards; plus graphic/logo design, project/data analysis, website/software,
printing and branding.

For A'Cube Tech prices, official charges, live admission deadlines, current school requirements,
stock/availability, or other changing business information, do not invent facts. Tell the user that
the current details should be confirmed with A'Cube Tech and offer the WhatsApp contact:
09018038314. Secondary number: 08114885904.

Never ask for or encourage users to share OTPs, card PINs, BVN, passwords, or other highly sensitive
credentials. If a task requires a professional or official determination, clearly say so.

Keep normal answers concise but provide enough working for problem-solving questions. Use Markdown
when it improves readability.
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5.6-terra",
        instructions,
        input: messages,
        reasoning: { effort: "low" },
        text: { verbosity: "medium" }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return { statusCode: response.status, headers, body: JSON.stringify({ error: data?.error?.message || "OpenAI request failed." }) };
    }

    let answer = data.output_text;
    if (!answer && Array.isArray(data.output)) {
      answer = data.output.flatMap(item => Array.isArray(item.content) ? item.content : [])
        .filter(item => item.type === "output_text")
        .map(item => item.text)
        .join("\n");
    }
    answer = answer || "I couldn't generate a response right now. Please try again.";

    return { statusCode: 200, headers, body: JSON.stringify({ answer }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "The AI service could not be reached." }) };
  }
};
