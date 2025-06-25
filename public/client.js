// --- CONFIG & STATE ---
const choices = ["stone", "paper", "scissor"];
let mode = null,
  currentRoomId = null,
  playerId = "",
  localUsername = "Player",
  opponentUsername = "Waiting...",
  wins = 0,
  losses = 0,
  draws = 0;

const gameover = new Audio("gameover.mp3");
const winSound = new Audio("victory.mp3");
const drawSound = new Audio("draw.mp3");

const winBanter = ["You're on fire! 🔥", "Keep going, champion!", "Nice move!", "Epic battle!", "Unstoppable!"];
const loseBanter = ["Better luck next time!", "Try again!", "Close one!", "Oops!"];
const drawBanter = ["Try again!", "Even match!", "So close!", "Neck and neck!"];

let achievements = {
  firstWin: false,
  fiveWins: false,
  firstDraw: false,
  threeLosses: false
};

let selectedAvatar = localStorage.getItem("avatar") || "avtaar1.png";
let moveListenerAdded = false;

// --- INITIAL LOAD ---
window.addEventListener("load", () => {
  const loader = document.getElementById("loading");
  if (loader) loader.style.display = "none";
  const modeSelection = document.getElementById("mode-selection");
  if (modeSelection) modeSelection.style.display = "block";
  document.getElementById("profile-display").style.display = "flex";
  updateLeaderboard();
});

// --- AVATAR & PROFILE LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".avatar-option").forEach(img => {
    img.onclick = function () {
      selectedAvatar = this.dataset.avatar;
      highlightSelectedAvatar();
    };
  });
  highlightSelectedAvatar();

  const playerAvatar = document.getElementById("player-avatar");
  if (playerAvatar) playerAvatar.src = selectedAvatar;

  const storedName = localStorage.getItem("username");
  if (storedName) {
    localUsername = storedName;
    document.getElementById("local-username").innerText = localUsername;
  }

  const profileAvatar = document.getElementById('profile-display-avatar');
  const profileLabel = document.getElementById('profile-username-label');
  if (profileAvatar) profileAvatar.onclick = openProfileModal;
  if (profileLabel) profileLabel.onclick = openProfileModal;
  updateProfileDisplay();
});

function highlightSelectedAvatar() {
  document.querySelectorAll(".avatar-option").forEach(img => {
    img.classList.toggle('selected', img.dataset.avatar === selectedAvatar);
  });
}

function openProfileModal() {
  document.getElementById('profile-modal').style.display = 'block';
  document.getElementById('profile-username').value = localStorage.getItem('username') || "Player";
  highlightSelectedAvatar();
  document.getElementById('profile-username').focus();
}

function closeProfileModal() {
  document.getElementById('profile-modal').style.display = 'none';
}

function saveProfile() {
  const name = document.getElementById('profile-username').value.trim() || "Player";
  localUsername = name;
  localStorage.setItem('username', localUsername);
  localStorage.setItem('avatar', selectedAvatar);

  updateProfileDisplay();
  document.getElementById('local-username').innerText = localUsername;
  document.getElementById('player-avatar').src = selectedAvatar;
  document.getElementById('player-avatar-inline').src = selectedAvatar;

  closeProfileModal();

  document.getElementById("mode-selection").style.display = "flex";
  document.getElementById("profile-display").style.display = "flex";
  document.getElementById("back-button").style.display = "none";
  document.getElementById("game-ui").style.display = "none";
  document.getElementById("room-controls").style.display = "none";
  document.getElementById("avatar-section").style.display = "none";
  document.getElementById("opponent-avatar-section").style.display = "none";

  if (currentRoomId && playerId && typeof db !== "undefined") {
    db.ref(`rooms/${currentRoomId}/players/${playerId}/name`).set(localUsername);
    db.ref(`rooms/${currentRoomId}/players/${playerId}/avatar`).set(selectedAvatar);
  }
}

function updateProfileDisplay() {
  const name = localStorage.getItem('username') || "Player";
  const avatar = localStorage.getItem('avatar') || "avtaar1.png";
  document.getElementById('profile-username-label').innerText = name;
  document.getElementById('profile-display-avatar').src = avatar;
}

// --- MODE SELECTION ---
function selectMode(selectedMode) {
  mode = selectedMode;
  document.getElementById("mode-selection").style.display = "none";
  document.getElementById("back-button").style.display = "inline-block";
  document.getElementById("profile-display").style.display = "none";
  document.getElementById("main-heading").style.display = "none";

  const avatar = localStorage.getItem("avatar") || "avtaar1.png";
  document.getElementById("player-avatar-inline").src = avatar;

  if (mode === "bot") {
    opponentUsername = "Computer 🤖";
    document.getElementById("mode-status").innerHTML = `
      <span>${localUsername}</span> <img src="${avatar}" class="inline-avatar"> vs 
      <span class="inline-avatar" style="font-size: 28px; margin: 0 10px;">🤖</span> <span>${opponentUsername}</span>`;
    document.getElementById("game-ui").style.display = "block";
    document.getElementById("toggle-leaderboard-btn").style.display = "inline-block";
    document.getElementById("room-controls").style.display = "none";
    document.getElementById("avatar-section").style.display = "block";
    document.getElementById("opponent-avatar-section").style.display = "block";
    document.getElementById("opponent-avatar").style.display = "none";
    document.getElementById("local-username").innerText = localUsername;
    document.getElementById("opponent-username").innerText = opponentUsername;
  } else {
    opponentUsername = "Waiting...";
    document.getElementById("mode-status").innerHTML = `
      <span>${localUsername}</span> <img src="${avatar}" class="inline-avatar"> vs 
      <img src="loading.gif" class="inline-avatar"> <span>${opponentUsername}</span>`;
    document.getElementById("toggle-leaderboard-btn").style.display = "inline-block";
    document.getElementById("room-controls").style.display = "block";
    document.getElementById("avatar-section").style.display = "none";
    document.getElementById("opponent-avatar-section").style.display = "none";
  }

  showLoader(false);
  const bgMusic = document.getElementById("bg-music");
  if (bgMusic) {
    bgMusic.play().catch(err => console.warn("Autoplay blocked:", err));
  }
}

// --- GAME LOGIC ---
function handleChoice(choice) {
  if (mode === "bot") {
    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    showResult(localUsername, choice, opponentUsername, botChoice);
  } else {
    if (!currentRoomId || !playerId) return alert("Room or player not initialized.");

    db.ref(`rooms/${currentRoomId}/moves/${playerId}`).set(choice);

    if (!moveListenerAdded) {
      db.ref(`rooms/${currentRoomId}/moves`).on("value", (snapshot) => {
        const moves = snapshot.val();
        if (!moves || !moves.player1 || !moves.player2) return;

        const p1 = moves.player1;
        const p2 = moves.player2;

        const player1Name = playerId === "player1" ? localUsername : opponentUsername;
        const player2Name = playerId === "player2" ? localUsername : opponentUsername;

        const player1Choice = playerId === "player1" ? p1 : p2;
        const player2Choice = playerId === "player1" ? p2 : p1;

        showResult(player1Name, player1Choice, player2Name, player2Choice);

        setTimeout(() => {
          db.ref(`rooms/${currentRoomId}/moves`).remove();
        }, 1500);
      });
      moveListenerAdded = true;
    }
  }
}

function showResult(p1Name, p1Choice, p2Name, p2Choice) {
  const resultBox = document.getElementById("result");
  const banterBox = document.getElementById("banter");

  if (p1Choice === p2Choice) {
    drawSound.play();
    draws++;
    resultBox.innerHTML = `<p>Both chose ${p1Choice}. 🤝 It's a draw!</p><img src="image.png" alt="Draw" class="result-img" style="width:90px;">`;
    banterBox.innerText = drawBanter[Math.floor(Math.random() * drawBanter.length)];
    if (!achievements.firstDraw) {
      achievements.firstDraw = true;
      showAchievement("🎯 First Draw!");
    }
  } else if (
    (p1Choice === "stone" && p2Choice === "scissor") ||
    (p1Choice === "paper" && p2Choice === "stone") ||
    (p1Choice === "scissor" && p2Choice === "paper")
  ) {
    winSound.play();
    wins++;
    resultBox.innerHTML = `<p>${p1Name} wins! 🏆</p><img src="excited.gif" alt="Win" class="result-img" style="width:90px;">`;
    banterBox.innerText = winBanter[Math.floor(Math.random() * winBanter.length)];
    if (wins === 1 && !achievements.firstWin) {
      achievements.firstWin = true;
      showAchievement("🏅 First Win!");
    }
    if (wins === 5 && !achievements.fiveWins) {
      achievements.fiveWins = true;
      showAchievement("💪 5 Wins Streak!");
    }
  } else {
    gameover.play();
    losses++;
    resultBox.innerHTML = `<p>${p1Name} loses! ❌</p><img src="you lose.png" alt="Lose" class="result-img" style="width:90px;">`;
    banterBox.innerText = loseBanter[Math.floor(Math.random() * loseBanter.length)];
    if (losses === 3 && !achievements.threeLosses) {
      achievements.threeLosses = true;
      showAchievement("😢 3 Losses!");
    }
  }

  updateLeaderboard();
}

function resetGame() {
  wins = 0;
  losses = 0;
  draws = 0;
  achievements = {
    firstWin: false,
    fiveWins: false,
    firstDraw: false,
    threeLosses: false
  };
  document.getElementById("result").innerHTML = "";
  document.getElementById("banter").innerText = "";
  document.getElementById("achievement").innerText = "";
  updateLeaderboard();
}

function updateLeaderboard() {
  document.getElementById("wins").innerText = wins;
  document.getElementById("losses").innerText = losses;
  document.getElementById("draws").innerText = draws;
}

function showAchievement(message) {
  const achievementBox = document.getElementById("achievement");
  achievementBox.innerText = message;
  achievementBox.style.display = "block";
  achievementBox.style.position = "fixed";
  achievementBox.style.top = "50%";
  achievementBox.style.left = "50%";
  achievementBox.style.transform = "translate(-50%, -50%)";
  achievementBox.style.background = "#00fff0";
  achievementBox.style.color = "#232946";
  achievementBox.style.padding = "1rem 2rem";
  achievementBox.style.borderRadius = "1rem";
  achievementBox.style.fontSize = "1.5rem";
  achievementBox.style.zIndex = "9999";

  setTimeout(() => {
    achievementBox.style.display = "none";
  }, 3000);
}

function toggleMusic() {
  const music = document.getElementById("bg-music");
  music.muted = !music.muted;
  music.play().catch(err => console.warn("Play issue:", err));
  document.getElementById("music-toggle-btn").innerText = music.muted ? "🔇 Unmute Music" : "🔊 Mute Music";
}

function goBack() {
  document.getElementById("game-ui").style.display = "none";
  document.getElementById("room-controls").style.display = "none";
  document.getElementById("avatar-section").style.display = "none";
  document.getElementById("opponent-avatar-section").style.display = "none";
  document.getElementById("mode-selection").style.display = "flex";
  document.getElementById("back-button").style.display = "none";
  document.getElementById("profile-display").style.display = "flex";
  document.getElementById("main-heading").style.display = "block";
}

function showLoader(messageOrFalse) {
  const loader = document.getElementById("loading");
  if (!loader) return;
  loader.innerText = typeof messageOrFalse === "string" ? messageOrFalse : "";
  loader.style.display = messageOrFalse ? "flex" : "none";
}

// --- LEADERBOARD MODAL ---
function showLeaderboard() {
  document.getElementById("leaderboard-modal").style.display = "block";
}
function closeLeaderboard() {
  document.getElementById("leaderboard-modal").style.display = "none";
}

// Optional: Close modal when clicking outside
window.addEventListener("click", function(e) {
  const modal = document.getElementById("leaderboard-modal");
  if (modal && e.target === modal) {
    modal.style.display = "none";
  }
});
