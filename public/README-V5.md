# A'Cube Tech V5

## What changed
- Added the supplied A'Cube Tech logo to the site.
- Removed the flyer and all flyer navigation/sections.
- Primary WhatsApp number is 09018038314.
- Secondary phone number remains 08114885904.
- Replaced the old service-matcher assistant with a real OpenAI-powered general AI assistant.
- The assistant can answer general questions, explain topics, solve problems, help with writing/study/programming tasks, and guide users to A'Cube Tech services.
- The OpenAI API key is kept server-side in a Netlify Function; it is not placed in the browser.

## Netlify setup for the AI
After deploying this site, open:
Site configuration → Environment variables

Add: OPENAI_API_KEY = your OpenAI API key

Optional:
OPENAI_MODEL = gpt-5.6-terra

Then redeploy the site so the function receives the variable.

Important: do not paste the OpenAI API key into index.html or JavaScript. Keep it as a Netlify environment variable.

The AI uses OpenAI's Responses API through `netlify/functions/chat.js`.
