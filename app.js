import { getAnswerWithMeta } from './answers.js';

// ── DOM refs ──────────────────────────────────────────────────
const input = document.getElementById('wish-input');
const btn = document.getElementById('ask-btn');
const answerBox = document.getElementById('answer-box');
const placeholder = document.getElementById('placeholder');
const answerLabel = document.getElementById('answer-label');
const answerText = document.getElementById('answer-text');
const categoryTag = document.getElementById('category-tag');
const actionsBar = document.getElementById('actions');
const historyList = document.getElementById('history-list');
const historySection = document.getElementById('history-section');
const shareBtn = document.getElementById('share-btn');
const copyBtn = document.getElementById('copy-btn');
const againBtn = document.getElementById('again-btn');
const confettiCanvas = document.getElementById('confetti');

// ── State ─────────────────────────────────────────────────────
let lastWish = '';
let lastAnswer = '';
const history = [];
const MAX_HISTORY = 5;

// ── Suggestions ───────────────────────────────────────────────
document.querySelectorAll('.chip').forEach((chip) => {
  chip.addEventListener('click', () => {
    input.value = chip.dataset.wish;
    input.focus();
    submit();
  });
});

// ── Submit ────────────────────────────────────────────────────
function showLoading() {
  placeholder.style.display = 'none';
  answerLabel.classList.remove('visible');
  answerText.classList.remove('visible');
  categoryTag.classList.remove('visible');

  const dots = document.createElement('div');
  dots.className = 'loading-dots';
  dots.id = 'loading-dots';
  dots.innerHTML = '<span>.</span><span>.</span><span>.</span>';

  const existing = document.getElementById('loading-dots');
  if (existing) existing.remove();
  answerBox.appendChild(dots);
}

function hideLoading() {
  const dots = document.getElementById('loading-dots');
  if (dots) dots.remove();
}

function submit() {
  const wish = input.value.trim();
  if (!wish) return;

  showLoading();

  // Tiny fake delay for dramatic effect
  setTimeout(() => {
    const { answer, category } = getAnswerWithMeta(wish);
    lastWish = wish;
    lastAnswer = answer;

    hideLoading();

    // Reveal answer
    answerText.textContent = answer;
    categoryTag.textContent = category
      ? category.replace(/_/g, ' ')
      : 'universal wisdom';

    requestAnimationFrame(() => {
      answerLabel.classList.add('visible');
      answerText.classList.add('visible');
      categoryTag.classList.add('visible');
      actionsBar.classList.add('visible');
    });

    // Confetti burst
    spawnConfetti();

    // Push to history
    addHistory(wish, answer);

    // Clear input
    input.value = '';
    input.focus();
  }, 400 + Math.random() * 300);
}

btn.addEventListener('click', submit);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submit();
});

// ── "Another one" ─────────────────────────────────────────────
againBtn.addEventListener('click', () => {
  if (!lastWish) return;

  showLoading();

  setTimeout(() => {
    const { answer, category } = getAnswerWithMeta(lastWish);
    lastAnswer = answer;

    hideLoading();

    answerText.textContent = answer;
    categoryTag.textContent = category
      ? category.replace(/_/g, ' ')
      : 'universal wisdom';

    requestAnimationFrame(() => {
      answerLabel.classList.add('visible');
      answerText.classList.add('visible');
      categoryTag.classList.add('visible');
    });

    spawnConfetti();
    addHistory(lastWish, answer);
  }, 300 + Math.random() * 200);
});

// ── Share / Copy ──────────────────────────────────────────────
shareBtn.addEventListener('click', () => {
  const text = `I wanted to be ${lastWish}.\n\nAdvice: "${lastAnswer}"\n\n— I Want To Be...`;
  const url = window.location.href;

  if (navigator.share) {
    navigator.share({ title: 'I Want To Be...', text, url }).catch(() => {});
  } else {
    const tweetUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(tweetUrl, '_blank', 'noopener');
  }
});

copyBtn.addEventListener('click', () => {
  const text = `I wanted to be ${lastWish}. Advice: "${lastAnswer}"`;
  navigator.clipboard.writeText(text).then(() => {
    copyBtn.classList.add('copied');
    copyBtn.textContent = 'COPIED!';
    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyBtn.textContent = 'COPY';
    }, 1500);
  });
});

// ── History ───────────────────────────────────────────────────
function addHistory(wish, answer) {
  history.unshift({ wish, answer });
  if (history.length > MAX_HISTORY) history.pop();
  renderHistory();
}

function renderHistory() {
  if (history.length === 0) {
    historySection.style.display = 'none';
    return;
  }
  historySection.style.display = '';
  historyList.innerHTML = '';
  for (const h of history) {
    const item = document.createElement('div');
    item.className = 'history-item';

    const wish = document.createElement('span');
    wish.className = 'wish';
    wish.textContent = `I want to be ${h.wish}`;

    const sep = document.createElement('span');
    sep.className = 'sep';
    sep.textContent = '\u2192';

    const advice = document.createElement('span');
    advice.className = 'advice';
    advice.textContent = ` ${h.answer}`;

    item.append(wish, sep, advice);
    historyList.appendChild(item);
  }
}

// ── Confetti (canvas-based, using ink/yellow/red palette) ─────
function spawnConfetti() {
  const ctx = confettiCanvas.getContext('2d');
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const colors = ['#f7e000', '#e8321a', '#1a1a1a', '#8a8070', '#f5f0e8'];
  const particles = Array.from({ length: 50 }, () => ({
    x: Math.random() * confettiCanvas.width,
    y: -10 - Math.random() * 40,
    w: 4 + Math.random() * 6,
    h: 3 + Math.random() * 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - 0.5) * 4,
    vy: 2 + Math.random() * 4,
    rot: Math.random() * Math.PI * 2,
    rv: (Math.random() - 0.5) * 0.2,
    life: 1,
  }));

  let raf;
  function tick() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let alive = false;
    for (const p of particles) {
      if (p.life <= 0) continue;
      alive = true;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.12;
      p.rot += p.rv;
      p.life -= 0.013;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }
    if (alive) {
      raf = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }
  cancelAnimationFrame(raf);
  tick();
}

// ── Focus input on load ───────────────────────────────────────
input.focus();
