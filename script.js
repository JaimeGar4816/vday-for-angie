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

function setHint(msg) {
  hint.textContent = msg;
}

function onlyDigits(s) {
  return (s || "").replace(/[^\d]/g, "");
}

function normalizeTypedDate(s) {
  const raw = (s || "").trim();
  const digits = onlyDigits(raw);

  if (digits.length >= 8) {
    const mm = digits.slice(0,2);
    const dd = digits.slice(2,4);
    const yyyy = digits.slice(4,8);
    return `${mm}/${dd}/${yyyy}`;
  }
  if (digits.length >= 4) {
    const mm = digits.slice(0,2);
    const dd = digits.slice(2,4);
    return `${mm}/${dd}`;
  }
  return raw;
}

input.addEventListener("input", () => {
  const digits = onlyDigits(input.value);

  if (digits.length <= 4) {
    let out = "";
    if (digits.length >= 2) out = digits.slice(0,2);
    else out = digits;

    if (digits.length > 2) out += "/" + digits.slice(2,4);
    input.value = out.slice(0,5);
    return;
  }

  const mm = digits.slice(0,2);
  const dd = digits.slice(2,4);
  const yyyy = digits.slice(4,8);
  input.value = `${mm}/${dd}/${yyyy}`.slice(0,10);
});

unlockBtn.addEventListener("click", () => {
  const typed = normalizeTypedDate(input.value);
  const ok = (typed === ANNIVERSARY_FULL) || (typed === ANNIVERSARY_SHORT);

  if (!ok) {
    setHint("Not quite… try again ❤️");
    input.classList.add("shake");
    setTimeout(() => input.classList.remove("shake"), 380);
    return;
  }

  setHint("");
  heartStage.classList.add("open");

  setTimeout(() => {
    show(reasonsScreen);
  }, 950);
});

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

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

  // DRAMATIC MOMENT
  reasonsScreen.classList.add("freeze");
  reasonText.className = "reason you";
  reasonText.textContent = "YOU.";
  await sleep(1900);

  show(finalScreen);
  launchHearts(6500, 95);

  // reset final UI state each time
  loveMsg.classList.add("hidden");
  loveLine2.classList.add("hidden");
  choiceWrap.classList.remove("hidden");
  placeNoRandom();

  running = false;
}

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
  if (pick < 0.33) el.textContent = "❤️";
  else if (pick < 0.66) el.textContent = "💖";
  else el.textContent = "💕";

  el.style.left = Math.floor(Math.random() * 92 + 4) + "%";
  el.style.fontSize = Math.floor(Math.random() * 18 + 18) + "px";
  floatZone.appendChild(el);

  setTimeout(() => el.remove(), 3000);
}

/* ---------- NO BUTTON DODGE ---------- */

function rand(min, max) { return Math.random() * (max - min) + min; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function placeNoRandom() {
  const wrapRect = choiceWrap.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();
  const padding = 8;

  const maxX = wrapRect.width - noRect.width - padding;
  const maxY = wrapRect.height - noRect.height - padding;

  const x = rand(padding, Math.max(padding, maxX));
  const y = rand(padding, Math.max(padding, maxY));

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
  noBtn.style.transform = "translate(0, 0)";
}

function dodgeFromPoint(px, py) {
  const wrapRect = choiceWrap.getBoundingClientRect();
  const noRect = noBtn.getBoundingClientRect();

  const noCenterX = noRect.left + noRect.width / 2;
  const noCenterY = noRect.top + noRect.height / 2;

  const dx = noCenterX - px;
  const dy = noCenterY - py;

  const dist = Math.sqrt(dx*dx + dy*dy);
  const threshold = 120;
  if (dist > threshold) return;

  const push = 140;
  const nx = dx === 0 ? rand(-1,1) : dx / dist;
  const ny = dy === 0 ? rand(-1,1) : dy / dist;

  const currentLeft = parseFloat(noBtn.style.left || "0");
  const currentTop = parseFloat(noBtn.style.top || "0");

  let nextLeft = currentLeft + nx * push;
  let nextTop = currentTop + ny * push;

  const padding = 8;
  const maxLeft = wrapRect.width - noRect.width - padding;
  const maxTop = wrapRect.height - noRect.height - padding;

  nextLeft = clamp(nextLeft, padding, Math.max(padding, maxLeft));
  nextTop = clamp(nextTop, padding, Math.max(padding, maxTop));

  if (Math.abs(nextLeft - currentLeft) < 10 && Math.abs(nextTop - currentTop) < 10) {
    placeNoRandom();
    return;
  }

  noBtn.style.left = nextLeft + "px";
  noBtn.style.top = nextTop + "px";
  noBtn.style.transform = "translate(0, 0)";
}

choiceWrap.addEventListener("mousemove", (e) => dodgeFromPoint(e.clientX, e.clientY));
choiceWrap.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  dodgeFromPoint(t.clientX, t.clientY);
}, { passive: true });

noBtn.addEventListener("mouseenter", () => placeNoRandom());
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  placeNoRandom();
});

/* ---------- YES BUTTON ---------- */

yesBtn.addEventListener("click", () => {
  choiceWrap.classList.add("hidden");
  loveMsg.classList.remove("hidden");

  // ensure Forever starts hidden each time
  loveLine2.classList.add("hidden");

  // hearts now
  launchHearts(2600, 55);

  // then “Forever.” drops in
  setTimeout(() => {
    loveLine2.classList.remove("hidden");
    launchHearts(2200, 50);
  }, 950);
});

/* ---------- REPLAY ---------- */

function resetAll() {
  running = false;
  startBtn.disabled = false;

  reasonText.textContent = "";
  reasonText.className = "reason";
  reasonsScreen.classList.remove("freeze");

  heartStage.classList.remove("open");

  input.value = "";
  setHint("");

  floatZone.innerHTML = "";

  loveMsg.classList.add("hidden");
  loveLine2.classList.add("hidden");
  choiceWrap.classList.remove("hidden");

  show(lockScreen);
  setTimeout(() => input.focus(), 60);
}

startBtn.addEventListener("click", runReasons);
replayBtn1.addEventListener("click", resetAll);
replayBtn2.addEventListener("click", resetAll);
