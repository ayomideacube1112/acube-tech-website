const N8N_WEBHOOK_URL = process.env.N8N_CHAT_WEBHOOK_URL || 'https://ayomideacube.app.n8n.cloud/webhook/fdc648ee-7b19-444b-a3f9-92c597b3cb2a/chat';

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const chatInput = String(payload.chatInput || payload.message || '').trim();
    const sessionId = String(payload.sessionId || '').trim();

    if (!chatInput) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No message supplied.' })
      };
    }

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'sendMessage',
        sessionId: sessionId || undefined,
        chatInput
      })
    });

    const raw = await response.text();
    let data;
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      data = { output: raw };
    }

    if (!response.ok) {
      const message = data?.error || data?.message || data?.output || 'n8n AI request failed.';
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: String(message) })
      };
    }

    // n8n may return an object, an array, or a nested JSON item depending on
    // the Chat Trigger response mode. Normalize all common forms for the site.
    let answer = '';
    if (Array.isArray(data)) {
      const first = data[0];
      answer = first?.output ?? first?.response ?? first?.text ?? first?.json?.output ?? '';
    } else {
      answer = data?.output ?? data?.response ?? data?.text ?? data?.json?.output ?? '';
    }

    if (typeof answer !== 'string') answer = JSON.stringify(answer);
    answer = answer.trim();

    if (!answer) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: 'The AI workflow returned no response.' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ answer })
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: 'The A\'Cube AI connection could not be reached.' })
    };
  }
};
