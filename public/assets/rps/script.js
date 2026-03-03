// ============ STATE ============
let userScore = 0, botScore = 0;
let alertsOn = false;
let difficulty = 'easy';
let userHistory = []; // track last N user moves for AI prediction
let streak = 0;
let busy = false;

const EMOJIS = { r: '✊', p: '✋', s: '✌️' };
const NAMES  = { r: 'ROCK', p: 'PAPER', s: 'SCISSORS' };
const BEATS  = { r: 's', p: 'r', s: 'p' }; // key beats value
const LOSES  = { r: 'p', p: 's', s: 'r' }; // key loses to value

// DOM
const userScoreEl   = document.getElementById('user-score');
const botScoreEl    = document.getElementById('bot-score');
const resultMsgEl   = document.getElementById('result-msg');
const userHandEl    = document.getElementById('user-hand');
const botHandEl     = document.getElementById('bot-hand');
const botEmojiEl    = document.getElementById('bot-emoji');
const aiThinkingEl  = document.getElementById('ai-thinking');
const choicesEl     = document.getElementById('choices');
const historyEl     = document.getElementById('history');
const streakEl      = document.getElementById('streak-display');
const resetBtn      = document.getElementById('reset');
const toggleAlertsBtn = document.getElementById('toggle-alerts');
const countdownOverlay = document.getElementById('countdown-overlay');
const countdownNum  = document.getElementById('countdown-num');

// ============ DIFFICULTY BUTTONS ============
document.querySelectorAll('.diff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    difficulty = btn.dataset.diff;
    document.querySelectorAll('.diff-btn').forEach(b => {
      b.className = 'diff-btn';
    });
    btn.classList.add(`active-${difficulty}`);
  });
});

// ============ AI CHOICE (controlled randomness) ============
function getAIChoice(userChoice) {
  const random = () => ['r','p','s'][Math.floor(Math.random() * 3)];

  if (difficulty === 'easy') {
    // Mostly random, slight bias to lose
    const r = Math.random();
    if (r < 0.6) return random();
    return BEATS[userChoice]; // give user the win sometimes... wait, this helps user
    // Actually on easy, bot picks from a pool biased to lose
  }

  if (difficulty === 'easy') return random();

  if (difficulty === 'medium') {
    // 50% random, 50% tries to predict based on history
    if (Math.random() < 0.5 || userHistory.length < 3) return random();
    return predictAndCounter(userHistory);
  }

  if (difficulty === 'hard') {
    // Mostly predictive, slight randomness to feel fair
    if (Math.random() < 0.15 || userHistory.length < 2) return random();
    return predictAndCounter(userHistory);
  }
}

// Easy: bot favors picking the losing move (gives user slight advantage)
function getEasyChoice(userChoice) {
  const r = Math.random();
  if (r < 0.45) return BEATS[userChoice]; // bot loses (user wins)
  if (r < 0.7)  return random();
  return LOSES[userChoice]; // bot wins
  function random() { return ['r','p','s'][Math.floor(Math.random() * 3)]; }
}

function predictAndCounter(history) {
  // Count frequency of each move
  const freq = { r: 0, p: 0, s: 0 };
  history.slice(-8).forEach(m => freq[m]++);
  // Predict most likely next move
  const predicted = Object.keys(freq).reduce((a, b) => freq[a] >= freq[b] ? a : b);
  // Return counter
  return LOSES[predicted]; // the move that beats predicted
}

function getBotChoice(userChoice) {
  if (difficulty === 'easy') return getEasyChoice(userChoice);
  if (difficulty === 'medium') {
    if (Math.random() < 0.5 || userHistory.length < 3) {
      return ['r','p','s'][Math.floor(Math.random() * 3)];
    }
    return predictAndCounter(userHistory);
  }
  // Hard
  if (Math.random() < 0.12 || userHistory.length < 2) {
    return ['r','p','s'][Math.floor(Math.random() * 3)];
  }
  return predictAndCounter(userHistory);
}

// ============ GAME LOGIC ============
function getOutcome(u, b) {
  if (u === b) return 'draw';
  if (BEATS[u] === b) return 'win';
  return 'lose';
}

async function playRound(userChoice) {
  if (busy) return;
  busy = true;
  choicesEl.classList.add('locked');

  // Track user move
  userHistory.push(userChoice);
  if (userHistory.length > 20) userHistory.shift();

  // Highlight selected button
  document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected', 'flash'));
  const selBtn = document.getElementById(userChoice);
  selBtn.classList.add('selected', 'flash');

  // Show user hand immediately
  userHandEl.classList.remove('reveal', 'win-glow', 'lose-glow', 'draw-glow');
  void userHandEl.offsetWidth;
  userHandEl.textContent = EMOJIS[userChoice];
  userHandEl.classList.add('reveal');

  // AI thinking animation
  botEmojiEl.style.display = 'none';
  aiThinkingEl.classList.add('active');
  botHandEl.classList.remove('reveal', 'win-glow', 'lose-glow', 'draw-glow');

  // Think delay based on difficulty
  const thinkTime = difficulty === 'hard' ? 800 : difficulty === 'medium' ? 600 : 400;
  await delay(thinkTime);

  // AI picks
  const botChoice = getBotChoice(userChoice);

  // Reveal bot hand
  aiThinkingEl.classList.remove('active');
  botEmojiEl.style.display = '';
  botEmojiEl.textContent = EMOJIS[botChoice];
  botHandEl.classList.add('reveal');

  await delay(180);

  // Determine outcome
  const outcome = getOutcome(userChoice, botChoice);

  // Apply glows
  if (outcome === 'win') {
    userHandEl.classList.add('win-glow');
    botHandEl.classList.add('lose-glow');
    userScore++;
    userScoreEl.textContent = userScore;
    animatePop(userScoreEl);
    streak = streak > 0 ? streak + 1 : 1;
    spawnParticles(userHandEl, '#00f5c8');
  } else if (outcome === 'lose') {
    userHandEl.classList.add('lose-glow');
    botHandEl.classList.add('win-glow');
    botScore++;
    botScoreEl.textContent = botScore;
    animatePop(botScoreEl);
    streak = streak < 0 ? streak - 1 : -1;
    spawnParticles(botHandEl, '#ff3c6e');
  } else {
    userHandEl.classList.add('draw-glow');
    botHandEl.classList.add('draw-glow');
    streak = 0;
  }

  // Result message
  setResult(outcome, userChoice, botChoice);
  updateStreak();
  addHistoryDot(outcome);

  await delay(300);

  // Unlock
  choicesEl.classList.remove('locked');
  document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected', 'flash'));
  busy = false;
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function setResult(outcome, u, b) {
  resultMsgEl.className = 'result-msg';
  void resultMsgEl.offsetWidth;

  if (outcome === 'win') {
    resultMsgEl.textContent = `${NAMES[u]} beats ${NAMES[b]} — YOU WIN 🔥`;
    resultMsgEl.classList.add('win', 'animate');
  } else if (outcome === 'lose') {
    resultMsgEl.textContent = `${NAMES[b]} beats ${NAMES[u]} — AI WINS 💀`;
    resultMsgEl.classList.add('lose', 'animate');
  } else {
    resultMsgEl.textContent = `${NAMES[u]} vs ${NAMES[b]} — DRAW ⚡`;
    resultMsgEl.classList.add('draw', 'animate');
  }
}

function animatePop(el) {
  el.classList.remove('pop');
  void el.offsetWidth;
  el.classList.add('pop');
  el.addEventListener('animationend', () => el.classList.remove('pop'), { once: true });
}

function updateStreak() {
  if (streak === 0) {
    streakEl.textContent = '';
    streakEl.classList.remove('hot');
  } else if (streak > 0) {
    streakEl.textContent = streak >= 3 ? `🔥 ${streak}x WIN STREAK` : `WIN STREAK: ${streak}`;
    streakEl.classList.toggle('hot', streak >= 3);
  } else {
    const abs = Math.abs(streak);
    streakEl.textContent = abs >= 3 ? `💀 ${abs}x LOSS STREAK` : `LOSS STREAK: ${abs}`;
    streakEl.classList.remove('hot');
  }
}

function addHistoryDot(outcome) {
  const dot = document.createElement('div');
  dot.className = `hist-dot new ${outcome === 'win' ? 'w' : outcome === 'lose' ? 'l' : 'd'}`;
  historyEl.appendChild(dot);
  if (historyEl.children.length > 30) historyEl.removeChild(historyEl.firstChild);
}

// ============ PARTICLES ============
function spawnParticles(el, color) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const angle = (i / 12) * Math.PI * 2;
    const dist = 40 + Math.random() * 60;
    p.style.cssText = `
      left: ${cx}px; top: ${cy}px;
      width: ${4 + Math.random() * 5}px;
      height: ${4 + Math.random() * 5}px;
      background: ${color};
      box-shadow: 0 0 6px ${color};
      --tx: ${Math.cos(angle) * dist}px;
      --ty: ${Math.sin(angle) * dist}px;
    `;
    document.body.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }
}

// ============ RESET ============
resetBtn.addEventListener('click', () => {
  userScore = botScore = streak = 0;
  userHistory = [];
  userScoreEl.textContent = '0';
  botScoreEl.textContent = '0';
  userHandEl.className = 'hand-display user-hand';
  userHandEl.textContent = EMOJIS.r;
  botHandEl.className = 'hand-display bot-hand';
  botEmojiEl.textContent = EMOJIS.r;
  botEmojiEl.style.display = '';
  aiThinkingEl.classList.remove('active');
  resultMsgEl.className = 'result-msg idle';
  resultMsgEl.textContent = '— MAKE YOUR MOVE —';
  historyEl.innerHTML = '';
  streakEl.textContent = '';
  streakEl.classList.remove('hot');
  choicesEl.classList.remove('locked');
  document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected', 'flash'));
  busy = false;
});

// ============ ALERTS TOGGLE ============
toggleAlertsBtn.addEventListener('click', () => {
  alertsOn = !alertsOn;
  toggleAlertsBtn.textContent = alertsOn ? 'ALERTS ON' : 'ALERTS OFF';
});

// ============ CLICK HANDLERS ============
['r','p','s'].forEach(id => {
  document.getElementById(id).addEventListener('click', () => playRound(id));
});
