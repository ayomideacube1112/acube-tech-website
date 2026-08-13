# A'Cube Tech V5 — Proper Netlify Project

## Structure
- `public/` = website files published to visitors
- `netlify/functions/chat.js` = server-side OpenAI function
- `netlify.toml` = Netlify build/function configuration

## GitHub + Netlify deployment
1. Create a GitHub repository.
2. Upload the contents of this folder to the repository root.
3. In Netlify, connect the repository under Project configuration → Build & deploy → Continuous deployment → Repository.
4. Build command: `npm run build`
5. Publish directory: `public`
6. Functions directory: `netlify/functions`
7. Add `OPENAI_API_KEY` as a Netlify environment variable.
8. Optional: add `OPENAI_MODEL` if you want a different supported model.
9. Deploy/redeploy.

Never put the OpenAI API key in the website JavaScript or GitHub repository.
