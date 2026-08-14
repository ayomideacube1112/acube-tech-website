# A'Cube Tech — n8n AI Website

## AI assistant

The website chat is connected to the working A'Cube bot in n8n Cloud. The n8n workflow uses Google Gemini and Simple Memory.

The browser sends each message to `/.netlify/functions/chat`. The Netlify Function securely forwards the message to the n8n Chat Trigger webhook. No OpenAI API key is required for this website.

## Current n8n webhook

`https://ayomideacube.app.n8n.cloud/webhook/fdc648ee-7b19-444b-a3f9-92c597b3cb2a/chat`

## Deployment

- Build command: `npm run build`
- Publish directory: `public`
- Functions directory: `netlify/functions`

The Netlify Function uses the n8n webhook above by default. If the webhook ever changes, set `N8N_CHAT_WEBHOOK_URL` in Netlify environment variables and redeploy.
