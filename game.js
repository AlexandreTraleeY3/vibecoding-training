const arena = document.querySelector('#arena');
const moth = document.querySelector('#moth');
const scoreEl = document.querySelector('#score');
const bestEl = document.querySelector('#best');
const livesEl = document.querySelector('#lives');
const message = document.querySelector('#message');
const start = document.querySelector('#startButton');
const sound = document.querySelector('#soundButton');
let running = false, score = 0, lives = 3, x = 120, y = 290, entities = [], timer, audioOn = false;
let best = Number(localStorage.getItem('moon-moth-best') || 0); bestEl.textContent = String(best).padStart(3, '0');
const keys = new Set();
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
function placeMoth() { moth.style.transform = `translate(${x}px, ${y}px)`; }
function chirp(freq) { if (!audioOn) return; const ctx = new AudioContext(), osc = ctx.createOscillator(), gain = ctx.createGain(); osc.frequency.value = freq; gain.gain.setValueAtTime(.06, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .13); osc.connect(gain).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + .13); }
function make(type) { const el = document.createElement('div'); el.className = type === 'light' ? 'firefly' : 'thorn'; const rect = arena.getBoundingClientRect(); const item = { el, type, x: rect.width + 20, y: 45 + Math.random() * (rect.height - 115), speed: (type === 'light' ? 2.2 : 2.8) + score / 90 }; el.style.left = item.x + 'px'; el.style.top = item.y + 'px'; arena.append(el); entities.push(item); }
function endGame() { running = false; clearInterval(timer); best = Math.max(best, score); localStorage.setItem('moon-moth-best', best); bestEl.textContent = String(best).padStart(3, '0'); message.innerHTML = `FLIGHT OVER<small>NECTAR GATHERED: ${score}<br>PRESS ENTER TO TRY AGAIN</small>`; message.classList.add('show'); }
function update() { if (!running) return; const rect = arena.getBoundingClientRect(); const speed = 4.3; if (keys.has('ArrowLeft') || keys.has('a')) x -= speed; if (keys.has('ArrowRight') || keys.has('d')) x += speed; if (keys.has('ArrowUp') || keys.has('w')) y -= speed; if (keys.has('ArrowDown') || keys.has('s')) y += speed; x = clamp(x, 5, rect.width - 55); y = clamp(y, 10, rect.height - 43); placeMoth();
  entities.forEach(item => { item.x -= item.speed; item.el.style.left = item.x + 'px'; const hit = x + 45 > item.x && x < item.x + 45 && y + 30 > item.y && y < item.y + 45; if (hit) { if (item.type === 'light') { score += 10; scoreEl.textContent = String(score).padStart(3, '0'); moth.classList.add('flicker'); setTimeout(() => moth.classList.remove('flicker'), 120); chirp(770); } else { lives--; livesEl.textContent = '♥ '.repeat(lives).trim() || '—'; chirp(160); if (!lives) endGame(); } item.el.remove(); item.x = -999; } if (item.x < -90) item.el.remove(); }); entities = entities.filter(i => i.x > -90); requestAnimationFrame(update); }
function launch() { entities.forEach(i => i.el.remove()); entities = []; score = 0; lives = 3; x = 90; y = arena.clientHeight / 2; scoreEl.textContent = '000'; livesEl.textContent = '♥ ♥ ♥'; message.classList.remove('show'); arena.classList.add('playing'); running = true; placeMoth(); clearInterval(timer); timer = setInterval(() => { if (running) make(Math.random() < .67 ? 'light' : 'thorn'); }, 700); requestAnimationFrame(update); arena.focus(); }
start.addEventListener('click', launch); document.addEventListener('keydown', e => { if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','w','a','s','d','Enter'].includes(e.key)) e.preventDefault(); if (e.key === 'Enter' && !running) launch(); keys.add(e.key); }); document.addEventListener('keyup', e => keys.delete(e.key));
sound.addEventListener('click', () => { audioOn = !audioOn; sound.textContent = `SOUND: ${audioOn ? 'ON' : 'OFF'}`; chirp(520); });
for (let i = 0; i < 25; i++) { const dot = document.createElement('span'); dot.className = 'firefly'; dot.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;transform:scale(${.15+Math.random()*.25});opacity:.28;animation-delay:-${Math.random()*3}s`; document.querySelector('#fireflies').append(dot); }
placeMoth();
