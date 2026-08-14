# A'Cube Tech — Netlify deployment

## GitHub

Upload the contents of this folder to the root of the A'Cube Tech GitHub repository.

## Netlify settings

- Build command: `npm run build`
- Publish directory: `public`
- Functions directory: `netlify/functions`

`netlify.toml` already contains the publish and functions configuration.

## AI connection

The site uses the working A'Cube Tech n8n Cloud chatbot. No OpenAI API key is required. The Netlify Function at `netlify/functions/chat.js` forwards chat messages to the n8n Chat Trigger and returns the AI answer to the website.

Optional environment variable:

`N8N_CHAT_WEBHOOK_URL`

Set it only if the n8n webhook URL changes.

## Important

Keep the n8n workflow published/active. If the n8n workflow is unpublished, the website assistant will stop responding.
