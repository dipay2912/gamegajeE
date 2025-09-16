const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const leaderboardList = document.getElementById("leaderboard");
const startBtn = document.getElementById("startBtn");
const playerNameInput = document.getElementById("playerName");
const difficultySelect = document.getElementById("difficulty");

const clickSound = document.getElementById("clickSound");
const endSound = document.getElementById("endSound");

let score = 0;
let timeLeft = 30;
let activeBox = null;
let gameInterval, timerInterval;
let spawnRate = 1000; 
let boxLife = 900; 
let slowTimeActive = false; // efek slow spawn

// Ambil leaderboard dari localStorage
let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

// Update leaderboard tampilan
function updateLeaderboardDisplay() {
  leaderboardList.innerHTML = "";
  leaderboard.forEach((entry, i) => {
    const li = document.createElement("li");
    li.textContent = `#${i + 1} - ${entry.name} : ${entry.score} poin`;
    leaderboardList.appendChild(li);
  });
}
updateLeaderboardDisplay();

function startGame() {
  const playerName = playerNameInput.value.trim();
  if (playerName === "") {
    alert("Masukkan nama dulu sebelum main!");
    return;
  }

  // Atur kesulitan
  const difficulty = difficultySelect.value;
  if (difficulty === "easy") {
    spawnRate = 1200;
    boxLife = 1000;
  } else if (difficulty === "medium") {
    spawnRate = 800;
    boxLife = 700;
  } else if (difficulty === "hard") {
    spawnRate = 500;
    boxLife = 400;
  }

  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  startBtn.disabled = true;
  playerNameInput.disabled = true;
  difficultySelect.disabled = true;

  timerInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  spawnBoxLoop();
}

function spawnBoxLoop() {
  if (activeBox) activeBox.remove();
  createBox();

  // kalau ada efek slow → spawn lebih lambat
  let currentRate = slowTimeActive ? spawnRate + 500 : spawnRate;

  gameInterval = setTimeout(spawnBoxLoop, currentRate);
}

function createBox() {
  const box = document.createElement("div");

  // Tentukan jenis kotak
  const rand = Math.random();
  if (rand < 0.15) { 
    box.classList.add("box", "gold"); // 15% emas
  } else if (rand < 0.25) { 
    box.classList.add("box", "blue"); // 10% biru
  } else if (rand < 0.35) { 
    box.classList.add("box", "green"); // 10% hijau
  } else {
    box.classList.add("box"); // normal
  }

  const areaWidth = gameArea.clientWidth - 50;
  const areaHeight = gameArea.clientHeight - 50;

  const x = Math.floor(Math.random() * areaWidth);
  const y = Math.floor(Math.random() * areaHeight);

  box.style.left = `${x}px`;
  box.style.top = `${y}px`;

  box.addEventListener("click", () => {
    if (box.classList.contains("gold")) {
      score += 5;
    } else if (box.classList.contains("blue")) {
      slowTimeActive = true;
      setTimeout(() => slowTimeActive = false, 5000); // efek 5 detik
    } else if (box.classList.contains("green")) {
      timeLeft += 3;
    } else {
      score++;
    }

    scoreDisplay.textContent = score;
    timeDisplay.textContent = timeLeft;

    clickSound.currentTime = 0;
    clickSound.play();
    box.remove();
    activeBox = null;
  });

  activeBox = box;
  gameArea.appendChild(box);

  setTimeout(() => {
    if (box.parentNode) {
      box.remove();
      activeBox = null;
    }
  }, boxLife);
}

function endGame() {
  clearTimeout(gameInterval);
  clearInterval(timerInterval);
  if (activeBox) activeBox.remove();
  startBtn.disabled = false;
  playerNameInput.disabled = false;
  difficultySelect.disabled = false;
  endSound.play();

  const playerName = playerNameInput.value.trim();

  // Masukkan skor ke leaderboard
  leaderboard.push({ name: playerName, score: score });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 5);

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

  updateLeaderboardDisplay();

  alert("⏱ Waktu habis! Skor akhir kamu: " + score);
}

startBtn.addEventListener("click", startGame);
// --- Efek Partikel Background ---
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particlesArray = [];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Buat class Partikel
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1; // ukuran bintang
    this.speedY = Math.random() * 1 + 0.5; // kecepatan jatuh
    this.color = "rgba(255,255,255,0.8)";
  }

  update() {
    this.y += this.speedY;
    if (this.y > canvas.height) {
      this.y = 0 - this.size;
      this.x = Math.random() * canvas.width;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

// Buat banyak partikel
function initParticles() {
  particlesArray = [];
  for (let i = 0; i < 100; i++) {
    particlesArray.push(new Particle());
  }
}

// Animasi partikel
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}

// Resize canvas saat window berubah
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

// Mulai
initParticles();
animateParticles();
const toggleParticles = document.getElementById("toggleParticles");
let particlesEnabled = true;

toggleParticles.addEventListener("change", () => {
  particlesEnabled = toggleParticles.checked;
  if (!particlesEnabled) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // bersihin layar
  }
});

// Animasi
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (particlesEnabled) {
    particlesArray.forEach(p => {
      p.update();
      p.draw();
    });

    miniParticles.forEach((mp, index) => {
      mp.update();
      mp.draw();
      if (mp.alpha <= 0) miniParticles.splice(index, 1);
    });
  }

  requestAnimationFrame(animateParticles);
}
const bgMode = document.getElementById("bgMode");
let currentMode = "stars";

bgMode.addEventListener("change", () => {
  currentMode = bgMode.value;
  initParticles(); // reset partikel sesuai mode
});

// Class Partikel bintang
class StarParticle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedY = Math.random() * 1 + 0.5;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fill();
  }
  update() {
    this.y += this.speedY;
    if (this.y > canvas.height) {
      this.y = 0 - this.size;
      this.x = Math.random() * canvas.width;
    }
  }
}

// Class Partikel bubble
class BubbleParticle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 6 + 2;
    this.speedY = Math.random() * 0.5 + 0.2;
    this.alpha = Math.random() * 0.5 + 0.3;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(173,216,230,${this.alpha})`; // biru muda transparan
    ctx.fill();
  }
  update() {
    this.y -= this.speedY;
    if (this.y < -this.size) {
      this.y = canvas.height + this.size;
      this.x = Math.random() * canvas.width;
    }
  }
}

// Init partikel sesuai mode
function initParticles() {
  particlesArray = [];
  if (currentMode === "stars") {
    for (let i = 0; i < 100; i++) {
      particlesArray.push(new StarParticle());
    }
  } else if (currentMode === "bubbles") {
    for (let i = 0; i < 80; i++) {
      particlesArray.push(new BubbleParticle());
    }
  }
}

// Animasi
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (currentMode !== "none") {
    particlesArray.forEach(p => {
      p.update();
      p.draw();
    });
  }

  requestAnimationFrame(animateParticles);
}

// Resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

// Mulai default
initParticles();
animateParticles();
// Class Partikel galaksi (warna-warni + putar)
class GalaxyParticle {
  constructor() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = Math.random() * (canvas.width / 2); // orbit jarak
    this.angle = Math.random() * Math.PI * 2;
    this.speed = (Math.random() * 0.002) + 0.001;
    this.size = Math.random() * 2 + 1;

    // warna random (biru, ungu, pink, putih)
    const colors = ["#ffffff", "#ff69b4", "#9370db", "#87cefa"];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.angle += this.speed;
    this.x = canvas.width / 2 + this.radius * Math.cos(this.angle);
    this.y = canvas.height / 2 + this.radius * Math.sin(this.angle);
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

// Update initParticles agar ada mode galaksi
function initParticles() {
  particlesArray = [];
  if (currentMode === "stars") {
    for (let i = 0; i < 100; i++) {
      particlesArray.push(new StarParticle());
    }
  } else if (currentMode === "bubbles") {
    for (let i = 0; i < 80; i++) {
      particlesArray.push(new BubbleParticle());
    }
  } else if (currentMode === "galaxy") {
    for (let i = 0; i < 150; i++) {
      particlesArray.push(new GalaxyParticle());
    }
  }
}
const spaceAudio = document.getElementById("spaceAudio");

// Play/pause suara sesuai mode background
bgMode.addEventListener("change", () => {
  currentMode = bgMode.value;
  initParticles();

  if (currentMode === "galaxy") {
    spaceAudio.volume = 0.4; // volume sedang
    spaceAudio.play().catch(() => {
      console.log("User interaction dibutuhkan untuk play audio.");
    });
  } else {
    spaceAudio.pause();
    spaceAudio.currentTime = 0; // reset ke awal
  }
});

const toggleMusicBtn = document.getElementById("toggleMusic");
let musicEnabled = true;

toggleMusicBtn.addEventListener("click", () => {
  musicEnabled = !musicEnabled;
  if (musicEnabled) {
    toggleMusicBtn.textContent = "🔊 Musik";
    if (currentMode === "galaxy") {
      spaceAudio.play().catch(() => {});
    }
  } else {
    toggleMusicBtn.textContent = "🔇 Musik";
    spaceAudio.pause();
  }
});

// Update event saat ganti mode galaksi
bgMode.addEventListener("change", () => {
  currentMode = bgMode.value;
  initParticles();

  if (currentMode === "galaxy" && musicEnabled) {
    spaceAudio.volume = 0.4;
    spaceAudio.play().catch(() => {
      console.log("User interaction dibutuhkan untuk play audio.");
    });
  } else {
    spaceAudio.pause();
    spaceAudio.currentTime = 0;
  }
});
