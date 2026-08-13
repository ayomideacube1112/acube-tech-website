const menuBtn=document.querySelector('.menu-btn'),navLinks=document.querySelector('.nav-links');
menuBtn?.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');menuBtn.setAttribute('aria-expanded',open)});
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>{navLinks.classList.remove('open');menuBtn?.setAttribute('aria-expanded','false')}));
const year=document.getElementById('year'); if(year) year.textContent=new Date().getFullYear();

const wa='2349018038314';
const online=[
['📄','Birth Certificate','Birth Certificate service'],
['📍','State of Origin Certificate','State of Origin Certificate service'],
['✅',"O'Level Upload / Verification","O'Level Result Upload/Verification'],
['🎓','JAMB Original Result','JAMB Original Result'],
['📝','Post-UTME / Screening','Post-UTME / Screening Registration'],
['💳','Acceptance & School Fees','Acceptance & School Fees Payment'],
['📜','JAMB Admission Letter','JAMB Admission Letter'],
['🔑','WAEC Scratch Card','WAEC Scratch Card'],
['🔑','NECO Scratch Card','NECO Scratch Card'],
['🔑','NABTEB Scratch Card','NABTEB Scratch Card']
];
const creative=[
['🎨','Graphic / Flyer Design','Graphic or Flyer Design'],
['✨','Logo Design','Logo Design'],
['📊','Project / Data Analysis','Project / Data Analysis'],
['💻','Website Design','Website Design'],
['🖥️','Software / Digital Solutions','Software or Digital Solution'],
['🖨️','Printing & Branding','Printing and Branding']
];
function card(item){
  const [icon,title,service]=item;
  const text=`Hello A'Cube Tech 👋\n\nI need: ${service}.\n\nMy name is:\nInstitution (if applicable):\nDetails:\n\nPlease let me know the current requirements and price.`;
  return `<a class="online-item" href="https://wa.me/${wa}?text=${encodeURIComponent(text)}" target="_blank" rel="noopener"><span>${icon}</span><b>${title}</b><small>Request on WhatsApp →</small></a>`;
}
const onlineGrid=document.getElementById('onlineGrid'),creativeGrid=document.getElementById('creativeGrid');
if(onlineGrid) onlineGrid.innerHTML=online.map(card).join('');
if(creativeGrid) creativeGrid.innerHTML=creative.map(card).join('');

document.getElementById('requestForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const name=document.getElementById('name').value.trim();
  const service=document.getElementById('service').value;
  const school=document.getElementById('school').value.trim();
  const details=document.getElementById('details').value.trim();
  const text=`Hello A'Cube Tech 👋\n\nMy name is: ${name}\nService needed: ${service}\nSchool/Institution: ${school||'N/A'}\nDetails: ${details}\n\nPlease let me know the current requirements and price.`;
  window.open(`https://wa.me/${wa}?text=${encodeURIComponent(text)}`,'_blank','noopener');
});

/* Real OpenAI-powered A'Cube AI.
   The API key is NEVER placed in the browser. The browser calls /.netlify/functions/chat,
   and the Netlify function talks to OpenAI using OPENAI_API_KEY. */
(()=>{
  const body=document.getElementById('chatBody');
  const input=document.getElementById('chatInput');
  const send=document.getElementById('chatSend');
  const suggestions=document.getElementById('chatSuggestions');
  if(!body||!input||!send)return;

  const messages=[];
  let busy=false;

  function add(text,who='bot'){
    const d=document.createElement('div');
    d.className='msg '+who;
    d.textContent=text;
    body.appendChild(d);
    body.scrollTop=body.scrollHeight;
    return d;
  }
  function setBusy(v){
    busy=v; send.disabled=v; input.disabled=v;
    if(v) send.textContent='…'; else send.textContent='➤';
  }
  async function ask(text){
    text=text.trim();
    if(!text||busy)return;
    add(text,'user');
    messages.push({role:'user',content:text});
    input.value='';
    setBusy(true);
    const thinking=add('A\'Cube AI is thinking…','bot');
    try{
      const res=await fetch('/.netlify/functions/chat',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({messages})
      });
      const data=await res.json();
      thinking.remove();
      if(!res.ok) throw new Error(data.error||'AI request failed');
      const answer=data.answer||'Sorry, I could not generate a response right now.';
      add(answer,'bot');
      messages.push({role:'assistant',content:answer});
    }catch(err){
      thinking.remove();
      add('The AI connection is not available yet. If you have just deployed the site, make sure the Netlify OPENAI_API_KEY environment variable is set. You can still contact A\'Cube Tech on WhatsApp for help.','bot');
    }finally{setBusy(false);input.focus();}
  }
  send.addEventListener('click',()=>ask(input.value));
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ask(input.value)}});
  suggestions?.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>ask(b.dataset.prompt||b.textContent)));
})();

/* Keep all WhatsApp service buttons on the primary number. */
document.querySelectorAll('a[href*="wa.me"]').forEach(a=>{
  a.href=a.href.replace(/wa\.me\/\d+/,`wa.me/${wa}`);
});
