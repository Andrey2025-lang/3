document.addEventListener('DOMContentLoaded', ()=> {
  const recipient = document.getElementById('recipient');
  const message = document.getElementById('message');
  const sendBtn = document.getElementById('sendBtn');
  const previewBtn = document.getElementById('previewBtn');
  const overlay = document.getElementById('overlay');
  const toText = document.getElementById('toText');
  const msgText = document.getElementById('msgText');
  const closeBtn = document.getElementById('closeBtn');
  const replay = document.getElementById('replay');
  const miniText = document.querySelector('.mini-text');

  // Envelope elements
  const envelope = document.getElementById('envelope');
  const letterTo = document.getElementById('letterTo');
  const letterMsg = document.getElementById('letterMsg');

  // Preview live
  function updatePreview(){
    miniText.textContent = (message.value.trim() || 'Tu mensaje aquí...') + (recipient.value ? ` — ${recipient.value}` : '');
  }
  recipient.addEventListener('input', updatePreview);
  message.addEventListener('input', updatePreview);

  previewBtn.addEventListener('click', ()=> {
    updatePreview();
    alert((recipient.value?recipient.value + ', ':'') + (message.value || 'Que tengas un día hermoso!'));
  });

  sendBtn.addEventListener('click', ()=> showCard());

  closeBtn.addEventListener('click', hideCard);
  replay.addEventListener('click', ()=> { startConfetti(); playChime(); });

  function showCard(){
    const name = recipient.value ? recipient.value : 'amiga';
    toText.textContent = `¡Feliz cumple, ${name}!`;
    // Prepara la carta dentro del sobre
    letterTo.textContent = `Para: ${name}`;
    letterMsg.textContent = message.value || 'Te quiero mucho ❤️\nI love you 💖';
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden','false');
    // dejar sobre cerrado hasta que ella haga clic
    envelope.classList.remove('open'); envelope.classList.add('closed');
    stopConfetti();
  }
  function hideCard(){
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden','true');
    stopConfetti();
  }

  // Abrir sobre al hacer clic
  envelope.addEventListener('click', ()=>{
    if(envelope.classList.contains('open')) return;
    envelope.classList.remove('closed');
    envelope.classList.add('open');
    startConfetti();
    playChime();
  });

  // Simple confetti canvas
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  let particles = [];
  const colors = ['#ff6b6b','#ffd166','#6be7ff','#a78bfa','#ff9bb0','#9be89b'];

  function random(min,max){ return Math.random()*(max-min)+min; }
  function initParticles(n=120){
    particles = [];
    for(let i=0;i<n;i++){
      particles.push({
        x: random(0,W),
        y: random(-H,0),
        r: random(6,12),
        d: random(1,3),
        color: colors[Math.floor(random(0,colors.length))],
        tilt: random(-10,10),
        tiltSpeed: random(0.02,0.1)
      });
    }
  }

  let animId = null;
  function render(){
    ctx.clearRect(0,0,W,H);
    for(const p of particles){
      p.tilt += p.tiltSpeed;
      p.y += p.d;
      p.x += Math.sin(p.y * 0.01) * 0.7;
      if(p.y > H + 20) { p.y = random(-H,0); p.x = random(0,W); }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.tilt * Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r*0.6);
      ctx.restore();
    }
    animId = requestAnimationFrame(render);
  }

  function startConfetti(){
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initParticles(140);
    if(!animId) render();
  }
  function stopConfetti(){
    if(animId){ cancelAnimationFrame(animId); animId = null; ctx.clearRect(0,0,W,H); }
  }

  // Small chime using WebAudio
  function playChime(){
    try{
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const now = ac.currentTime;
      const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5 (short arpeggio)
      freqs.forEach((f,i)=>{
        const o = ac.createOscillator();
        const g = ac.createGain();
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0, now + i*0.12);
        g.gain.linearRampToValueAtTime(0.15, now + i*0.12 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, now + i*0.12 + 0.6);
        o.connect(g); g.connect(ac.destination);
        o.start(now + i*0.12); o.stop(now + i*0.12 + 0.7);
      });
    }catch(e){ /* muted or unsupported */ }
  }

  // Close overlay when clicking outside popup
  overlay.addEventListener('click', (e)=>{
    if(e.target === overlay) hideCard();
  });

  // keep canvas sized
  window.addEventListener('resize', ()=> {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  // small decorative cake flame inside popup
  const cakeEl = document.querySelectorAll('.cake');
  cakeEl.forEach(c=>{
    const flame = document.createElement('span');
    flame.className = 'flame';
    c.appendChild(flame);
  });

  const name = 'Yireth';
  const message = 'Te quiero mucho ❤️\nI love you 💖';

  toText.textContent = `Para: ${name}`;
  msgText.textContent = message;

  function openEnvelope(){
    if(envelope.classList.contains('open')) return;
    envelope.classList.remove('closed');
    envelope.classList.add('open');
  }

  envelope.addEventListener('click', openEnvelope);
  envelope.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
  });
});