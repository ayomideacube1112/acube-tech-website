const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
menuBtn?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded', 'false');
}));
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const wa = '2349018038314';
const online = [
  ['📄', 'Birth Certificate', 'Birth Certificate service'],
  ['📍', 'State of Origin Certificate', 'State of Origin Certificate service'],
  ['✅', "O'Level Upload / Verification", "O'Level Result Upload/Verification"],
  ['🎓', 'JAMB Original Result', 'JAMB Original Result'],
  ['📝', 'Post-UTME / Screening', 'Post-UTME / Screening Registration'],
  ['💳', 'Acceptance & School Fees', 'Acceptance & School Fees Payment'],
  ['📜', 'JAMB Admission Letter', 'JAMB Admission Letter'],
  ['🔑', 'WAEC Scratch Card', 'WAEC Scratch Card'],
  ['🔑', 'NECO Scratch Card', 'NECO Scratch Card'],
  ['🔑', 'NABTEB Scratch Card', 'NABTEB Scratch Card']
];
const creative = [
  ['🎨', 'Graphic / Flyer Design', 'Graphic or Flyer Design'],
  ['✨', 'Logo Design', 'Logo Design'],
  ['📊', 'Project / Data Analysis', 'Project / Data Analysis'],
  ['💻', 'Website Design', 'Website Design'],
  ['🖥️', 'Software / Digital Solutions', 'Software or Digital Solution'],
  ['🖨️', 'Printing & Branding', 'Printing and Branding']
];
function card(item) {
  const [icon, title, service] = item;
  const text = `Hello A'Cube Tech 👋\n\nI need: ${service}.\n\nMy name is:\nInstitution (if applicable):\nDetails:\n\nPlease let me know the current requirements and price.`;
  return `<a class="online-item" href="https://wa.me/${wa}?text=${encodeURIComponent(text)}" target="_blank" rel="noopener"><span>${icon}</span><b>${title}</b><small>Request on WhatsApp →</small></a>`;
}
const onlineGrid = document.getElementById('onlineGrid');
const creativeGrid = document.getElementById('creativeGrid');
if (onlineGrid) onlineGrid.innerHTML = online.map(card).join('');
if (creativeGrid) creativeGrid.innerHTML = creative.map(card).join('');

document.getElementById('requestForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const service = document.getElementById('service').value;
  const school = document.getElementById('school').value.trim();
  const details = document.getElementById('details').value.trim();
  const text = `Hello A'Cube Tech 👋\n\nMy name is: ${name}\nService needed: ${service}\nSchool/Institution: ${school || 'N/A'}\nDetails: ${details}\n\nPlease let me know the current requirements and price.`;
  window.open(`https://wa.me/${wa}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
});

/* A'Cube AI — n8n Cloud + Google Gemini via a Netlify proxy.
   The browser never needs an OpenAI key or a Gemini key. */
(() => {
  const body = document.getElementById('chatBody');
  const input = document.getElementById('chatInput');
  const send = document.getElementById('chatSend');
  const suggestions = document.getElementById('chatSuggestions');
  if (!body || !input || !send) return;

  const STORAGE_KEY = 'acube_n8n_session_id';
  let sessionId = localStorage.getItem(STORAGE_KEY);
  if (!sessionId) {
    sessionId = (crypto.randomUUID ? crypto.randomUUID() : `acube-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    localStorage.setItem(STORAGE_KEY, sessionId);
  }

  let busy = false;

  function add(text, who = 'bot') {
    const d = document.createElement('div');
    d.className = `msg ${who}`;
    d.textContent = text;
    body.appendChild(d);
    body.scrollTop = body.scrollHeight;
    return d;
  }

  function setBusy(value) {
    busy = value;
    send.disabled = value;
    input.disabled = value;
    send.textContent = value ? '…' : '➤';
  }

  async function ask(text) {
    text = text.trim();
    if (!text || busy) return;

    add(text, 'user');
    input.value = '';
    setBusy(true);
    const thinking = add("A'Cube AI is thinking…", 'bot');

    try {
      const res = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sendMessage', sessionId, chatInput: text })
      });

      const data = await res.json().catch(() => ({}));
      thinking.remove();
      if (!res.ok) throw new Error(data.error || 'AI request failed');

      const answer = String(data.answer || '').trim();
      if (!answer) throw new Error('Empty AI response');
      add(answer, 'bot');
    } catch (err) {
      thinking.remove();
      add("Sorry, I couldn't connect to A'Cube AI right now. Please try again or contact A'Cube Tech on WhatsApp.", 'bot');
      console.error('A\'Cube AI error:', err);
    } finally {
      setBusy(false);
      input.focus();
    }
  }

  send.addEventListener('click', () => ask(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      ask(input.value);
    }
  });
  suggestions?.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => ask(button.dataset.prompt || button.textContent));
  });
})();

document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
  a.href = a.href.replace(/wa\.me\/\d+/, `wa.me/${wa}`);
});
