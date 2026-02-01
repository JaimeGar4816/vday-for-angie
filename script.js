const ANNIVERSARY = "10/13/2022";

const screens = document.querySelectorAll(".screen");
const input = document.getElementById("annivInput");
const unlockBtn = document.getElementById("unlockBtn");
const startBtn = document.getElementById("startReasonsBtn");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const reasonText = document.getElementById("reasonText");
const loveMsg = document.getElementById("loveMsg");
const loveLine2 = document.getElementById("loveLine2");
const floatZone = document.getElementById("floatZone");

const bgMusic = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");

const reasons = [
  "Your beautiful brown eyes",
  "Your smile",
  "Your freckles",
  "Your laugh",
  "Your voice",
  "Your loyalty",
  "Your warmth",
  "Your love"
];

function show(id) {
  screens.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function playClick(strong=false) {
  const pop = clickSound.cloneNode();
  pop.volume = strong ? 1 : 0.75;
  pop.playbackRate = 0.95 + Math.random()*0.1;
  pop.play().catch(()=>{});
}

function startMusic() {
  bgMusic.volume = 0;
  bgMusic.play();
  let v = 0;
  const fade = setInterval(()=>{
    v += 0.02;
    bgMusic.volume = v;
    if (v >= .22) clearInterval(fade);
  },120);
}

unlockBtn.onclick = () => {
  playClick(true);
  if (input.value.replace(/\D/g,"") === "10132022") {
    startMusic();
    show("screen-reasons");
  }
};

startBtn.onclick = async () => {
  for (let r of reasons) {
    reasonText.textContent = r;
    reasonText.style.opacity = 1;
    await new Promise(r => setTimeout(r,700));
    reasonText.style.opacity = 0;
  }
  reasonText.textContent = "YOU.";
  reasonText.classList.add("you");
  await new Promise(r => setTimeout(r,1500));
  show("screen-final");
};

yesBtn.onclick = () => {
  playClick(true);
  loveMsg.classList.remove("hidden");
  setTimeout(()=>{
    loveLine2.classList.remove("hidden");
    bgMusic.volume = .28;
  },900);
};

noBtn.onmouseenter = () => {
  noBtn.style.left = Math.random()*80 + "%";
  noBtn.style.top = Math.random()*80 + "%";
};

input.addEventListener("keydown", e => {
  if ("0123456789BackspaceEnter".includes(e.key)) playClick();
});
