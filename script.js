const ANNIVERSARY_FULL = "10/13/2022";
const ANNIVERSARY_SHORT = "10/13";

const lockScreen = document.getElementById("screen-lock");
const reasonsScreen = document.getElementById("screen-reasons");
const finalScreen = document.getElementById("screen-final");

const heartStage = document.getElementById("heartStage");
const input = document.getElementById("annivInput");
const unlockBtn = document.getElementById("unlockBtn");
const hint = document.getElementById("hint");

const startBtn = document.getElementById("startReasonsBtn");
const replayBtn1 = document.getElementById("replayBtn1");
const replayBtn2 = document.getElementById("replayBtn2");
const reasonText = document.getElementById("reasonText");

const floatZone = document.getElementById("floatZone");

const choiceWrap = document.getElementById("choiceWrap");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const loveMsg = document.getElementById("loveMsg");
const loveLine2 = document.getElementById("loveLine2");

const bgMusic = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");
let musicStarted = false;
let running = false;

const reasons = [
  "Your beautiful brown eyes",
  "Your beautiful smile",
  "Your freckles",
  "Your long hair",
  "Your laugh",
  "Your voice",
  "Your touch",
  "Your emotions",
  "Your loyalty",
  "Your humor",
  "Your passion",
  "Your warmth",
  "Your love",
  "Your bravery",
  "Your mind (you’re smart)",
  "How affectionate you are"
];

function show(screen) {
  lockScreen.classList.remove("active");
  reasonsScreen.classList.remove("active");
  finalScreen.classList.remove("active");
  screen.classList.add("active");
}

function setHint(msg) { hint.textContent = msg; }

/* ---------- POP CLICK + MUSIC ---------- */
function playClick(strong = false) {
  if (!clickSound) return;

  const pop = clickSound.cloneNode();
  pop.volume = strong ? 1.0 : 0.88;
  pop.playbackRate = 0.95 + Math.random() * 0.1;
  pop.play().catch(() => {});

  if (strong) {
    setTimeout(() => {
      const echo = clickSound.cloneNode();
      echo.volume = 0.65;
      echo.playbackRate = pop.playbackRate + 0.03;
      echo.play().catch(() => {});
    }, 70);
  }
}

function startMusic() {
  if (musicStarted || !bgMusic) return;
  musicStarted = true;

  bgMusic.volume = 0.0;
  bgMusic.play().catch(() => {});

  let v = 0.0;
  const target = 0.22;
  const step = 0.02;
  const interval = 120;

  const fade = setInterval(() => {
    v += step;
    if (v >= target) {
      bgMusic.volume = target;
      clearInterval(fade);
      return;
    }
    bgMusic.volume = v;
  }, interval);
}

function swellMusic() {
  if (!bgMusic) return;
  const original = 0.22;
  const peak = 0.28;
  bgMusic.volume = peak;
  setTimeout(() => { bgMusic.volume = original; }, 2200);
}

/* ---------- DATE INPUT ---------- */
function onlyDigits(s) { return (s || "").replace(/[^\d]/g, ""); }

function normalizeTypedDate(s) {
  const raw = (s || "").trim();
  const digits = onlyDigits(raw);

  if (digits.length >= 8) {
    const mm = digits.slice(0, 2);
    const dd = digits.slice(2, 4);
    const yyyy = digits.slice(4, 8);
    return `${mm}/${dd}/${yyyy}`;
  }
  if (digits.length >= 4) {
    const mm = digits.slice(0, 2);
    const dd = digits.slice(2, 4);
    return `${mm}/${dd}`;
  }
  return raw;
}

input.addEventListener("input", () => {
  const digits = onlyDigits(input.value);

  if (digits.length <= 4) {
    let out = digits.slice(0, 2);
    if (digits.length > 2) out += "/" + digits.slice(2, 4);
    input.value = out.slice(0, 5);
    return;
  }

  const mm = digits.slice(0, 2);
  const dd = digits.slice(2, 4);
  const yyyy = digits.slice(4, 8);
  input.value = `${mm}/${dd}/${yyyy}`.slice(0, 10);
});

// keyboard pop while typing
input.addEventListener("keydown", (e) => {
  const allowed =
    (e.key >= "0" && e.key <= "9") ||
    e.key === "Backspace" ||
    e.key === "Enter";

  if (!allowed) return;

  if (e.key === "Enter") {
    playClick(true);
    unlockBtn.click();
    return;
  }

  playClick(false);
});

/* ---------- UNLOCK ---------- */
unlockBtn.addEventListener("click", () => {
  playClick(true);

  const typed = normalizeTypedDate(input.value);
  const ok = typed === ANNIVERSARY_FULL || typed === ANNIVERSARY_SHORT;

  if (!ok) {
    setHint("Not quite… try again ❤️");
    input.classList.add("shake");
    setTimeout(() => input.classList.remove("shake"), 380);
    return;
  }

  startMusic();
  setHint("");
  heartStage.classList.add("open");
  setTimeout(() => show(reasonsScreen), 950);
});

/* ---------- REASONS FLOW ---------- */
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function runReasons() {
  if (running) return;
  running = true;

  startBtn.disabled = true;

  for (let i = 0; i < reasons.length; i++) {
    reasonText.className = "reason";
    reasonText.textContent = reasons[i];
    void reasonText.offsetWidth;
    reasonText.classList.add("pop");
    await sleep(760);
  }

  reasonText.className = "reason you";
  reasonText.textContent = "YOU.";
  await sleep(1900);

  show(finalScreen);
  launchHearts(7000, 95);

  // reset final state
  loveMsg.classList.add("hidden");
  loveMsg.classList.remove("show");
  loveLine2.classList.remove("hidden"); // keep in DOM for animation
  choiceWrap.classList.remove("hidden");
  placeNoRandom();

  running = false;
}

startBtn.addEventListener("click", () => {
  playClick(false);
  runReasons();
});

/* ---------- FULLSCREEN HEARTS ---------- */
function launchHearts(durationMs, everyMs) {
  const start = Date.now();

  const timer = setInterval(() => {
    const now = Date.now();
    if (now - start > durationMs) {
      clearInterval(timer);
      return;
    }
    if (Math.random() < 0.18) {
      for (let i = 0; i < 4; i++) spawnHeart();
    } else {
      spawnHeart();
    }
  }, everyMs);
}

function spawnHeart() {
  const el = document.createElement("div");
  el.className = "float-heart";

  const pick = Math.random();
  el.textContent = pick < 0.33 ? "❤️" : (pick < 0.66 ? "💖" : "💕");

  el.style.left = Math.floor(Math.random() * 92 + 4) + "%";
  el.style.fontSize = Math.floor(Math.random() * 18 + 18) + "px";
  floatZone.appendChild(el);

  setTimeout(() => el.remove(), 3100);
}

/* ---------- NO BUTTON DODGE (FULL PAGE) ---------- */
function rand(min, max) { return Math.random() * (max - min) + min; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function placeNoRandom() {
  const pad = 14;
  const noRect = noBtn.getBoundingClientRect();

  // important: prevent stretching
  noBtn.style.right = "auto";
  noBtn.style.bottom = "auto";

  const maxLeft = window.innerWidth - noRect.width - pad;
  const maxTop = window.innerHeight - noRect.height - pad;

  const left = rand(pad, Math.max(pad, maxLeft));
  const top = rand(pad, Math.max(pad, maxTop));

  noBtn.style.left = left + "px";
  noBtn.style.top = top + "px";
}

function dodgeFromPoint(px, py) {
  const noRect = noBtn.getBoundingClientRect();
  const cx = noRect.left + noRect.width / 2;
  const cy = noRect.top + noRect.height / 2;

  const dx = cx - px;
  const dy = cy - py;

  const dist = Math.sqrt(dx * dx + dy * dy);
  const threshold = 130;
  if (dist > threshold) return;

  const push = 220;
  const nx = dx === 0 ? rand(-1, 1) : dx / dist;
  const ny = dy === 0 ? rand(-1, 1) : dy / dist;

  const pad = 14;

  noBtn.style.right = "auto";
  noBtn.style.bottom = "auto";

  let nextLeft = noRect.left + nx * push;
  let nextTop = noRect.top + ny * push;

  const maxLeft = window.innerWidth - noRect.width - pad;
  const maxTop = window.innerHeight - noRect.height - pad;

  nextLeft = clamp(nextLeft, pad, Math.max(pad, maxLeft));
  nextTop = clamp(nextTop, pad, Math.max(pad, maxTop));

  noBtn.style.left = nextLeft + "px";
  noBtn.style.top = nextTop + "px";
}

document.addEventListener("mousemove", (e) => {
  if (!finalScreen.classList.contains("active")) return;
  dodgeFromPoint(e.clientX, e.clientY);
});

document.addEventListener("touchstart", (e) => {
  if (!finalScreen.classList.contains("active")) return;
  const t = e.touches[0];
  dodgeFromPoint(t.clientX, t.clientY);
}, { passive: true });

noBtn.addEventListener("mouseenter", () => {
  if (finalScreen.classList.contains("active")) placeNoRandom();
});
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (finalScreen.classList.contains("active")) placeNoRandom();
});

/* ---------- YES BUTTON (RESTORE CINEMATIC EFFECT) ---------- */
yesBtn.addEventListener("click", () => {
  playClick(true);

  choiceWrap.classList.add("hidden");

  loveMsg.classList.remove("hidden");
  loveMsg.classList.remove("show");

  // restart animation cleanly
  void loveMsg.offsetWidth;
  loveMsg.classList.add("show");

  launchHearts(2600, 55);

  setTimeout(() => {
    swellMusic();
    launchHearts(2200, 50);
  }, 950);
});

/* ---------- REPLAY ---------- */
function resetAll() {
  running = false;
  startBtn.disabled = false;

  reasonText.textContent = "";
  reasonText.className = "reason";

  heartStage.classList.remove("open");
  input.value = "";
  setHint("");

  floatZone.innerHTML = "";

  loveMsg.classList.add("hidden");
  loveMsg.classList.remove("show");
  choiceWrap.classList.remove("hidden");

  musicStarted = false;
  if (bgMusic) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
  }

  // reset NO to top-right
  noBtn.style.left = "";
  noBtn.style.top = "";
  noBtn.style.right = "24px";
  noBtn.style.bottom = "auto";

  show(lockScreen);
  setTimeout(() => input.focus(), 60);
}

replayBtn1.addEventListener("click", () => { playClick(false); resetAll(); });
replayBtn2.addEventListener("click", () => { playClick(false); resetAll(); });
window.addEventListener("resize", () => {
  if (finalScreen.classList.contains("active")) placeNoRandom();
});
