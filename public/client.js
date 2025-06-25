// const socket = io();

// let roomId = "";

// function joinRoom() {
//   roomId = document.getElementById("room-input").value;
//   socket.emit("join-room", roomId);
//   document.getElementById("status").innerText = "Waiting for opponent...";
// }

// socket.on("start-game", () => {
//   document.getElementById("game").style.display = "block";
//   document.getElementById("status").innerText = "Game Started!";
// });

// function sendChoice(choice) {
//   socket.emit("submit-choice", { roomId, choice });
// }

// socket.on("round-result", ({ choices, result }) => {
//   document.getElementById("status").innerText =
//     `You chose: ${choices[socket.id]}\nOpponent chose: ${
//       Object.entries(choices).find(([id]) => id !== socket.id)[1]
//     }\n${result}`;
// });

// socket.on("player-left", () => {
//   document.getElementById("status").innerText = "Opponent left the game.";
// });



// // ---------- CONFIG & STATE ----------
// const socket = io();
// const choices = ["stone", "paper", "scissor"];
// let mode = null,
//     roomId = "",
//     wins = 0,
//     losses = 0,
//     draws = 0;

// const gameover = new Audio("gameover.mp3"),
//       winSound = new Audio("victory.mp3"),
//       drawSound = new Audio("draw.mp3");

// const winBanter  = ["You're on fire! 🔥","Keep going, champion!","Nice move!","Epic battle!","Unstoppable!"],
//       loseBanter = ["Better luck next time!","Try again!","Close one!","Oops!"],
//       drawBanter = ["Try again!","Even match!","So close!","Neck and neck!"];

// let achievements = {
//   firstWin: false,
//   fiveWins: false,
//   firstDraw: false,
//   threeLosses: false
// };

// // ---------- MODE SELECTION ----------
// function selectMode(selectedMode) {
//   mode = selectedMode;

//   document.getElementById("mode-selection").style.display = "none";
//   document.getElementById("toggle-leaderboard-btn").style.display = "inline-block";

//   if (mode === "bot") {
//     document.getElementById("mode-status").innerText = "Playing vs Computer 🤖";
//     document.getElementById("room-controls").style.display = "none";
//     document.getElementById("game-ui").style.display = "block";
//   } else {
//     document.getElementById("mode-status").innerText = "Online Multiplayer Mode 🌐";
//     document.getElementById("room-controls").style.display = "block";
//     document.getElementById("game-ui").style.display = "none";
//   }
// }

// // ---------- BUTTON HANDLER ----------
// function handleChoice(choice) {
//   if (mode === "bot") playWithBot(choice);
//   else sendChoice(choice);
// }

// // ---------- BOT MODE ----------
// function playWithBot(userChoice) {
//   const comp = choices[Math.floor(Math.random() * choices.length)];
//   const res = getResult(userChoice, comp);
//   showResult(userChoice, comp, res);
// }

// // ---------- ONLINE MODE (Socket.IO) ----------
// function joinRoom() {
//   roomId = document.getElementById("room-id").value.trim();
//   if (!roomId) return alert("Enter room code to join");
//   socket.emit("join-room", roomId);
//   document.getElementById("room-controls").style.display = "none";
//   document.getElementById("status").innerText = "Waiting for opponent...";
// }

// socket.on("start-game", () => {
//   document.getElementById("game-ui").style.display = "block";
//   document.getElementById("status").innerText = "Game Started!";
// });

// function sendChoice(choice) {
//   if (!roomId) return alert("Join a room first");
//   socket.emit("submit-choice", { roomId, choice });
// }

// socket.on("round-result", ({ choices, result }) => {
//   const userChoice = choices[socket.id];
//   const opponentChoice = Object.entries(choices).find(([id]) => id !== socket.id)[1];
//   showResult(userChoice, opponentChoice, result);
// });

// socket.on("player-left", () => {
//   document.getElementById("status").innerText = "Opponent left the game.";
// });

// // ---------- SHARED LOGIC ----------
// function getResult(u, o) {
//   if (u === o) return "It's a draw!";
//   if ((u === "stone" && o === "scissor") ||
//       (u === "paper" && o === "stone") ||
//       (u === "scissor" && o === "paper")) {
//     return "You win!";
//   }
//   return "You lose!";
// }

// function showResult(u, o, res) {
//   const rd = document.getElementById("result"),
//         bd = document.getElementById("banter");

//   let html = `You chose: ${u}<br>Opponent chose: ${o}<br>${res}`;
//   if (res === "You win!") {
//     wins++;
//     winSound.play();
//     html += `<br><img src="excited.gif" style="width:100px;">`;
//   } else if (res === "You lose!") {
//     losses++;
//     gameover.pause(); gameover.currentTime = 0; gameover.play();
//     html += `<br><img src="you lose.png" style="width:80px;">`;
//   } else {
//     draws++;
//     drawSound.play();
//     html += `<br><img src="image.png" style="width:80px;">`;
//   }

//   rd.innerHTML = html;
//   const banterArr = res === "You win!" ? winBanter : res === "You lose!" ? loseBanter : drawBanter;
//   bd.innerText = banterArr[Math.floor(Math.random() * banterArr.length)];

//   updateLeaderboard();
//   checkAchievements();
// }

// function resetGame() {
//   ["result", "banter", "achievement"].forEach(id => {
//     document.getElementById(id).innerText = "";
//   });
//   wins = losses = draws = 0;
//   achievements = {
//     firstWin: false,
//     fiveWins: false,
//     firstDraw: false,
//     threeLosses: false
//   };
//   updateLeaderboard();
// }

// function updateLeaderboard() {
//   document.getElementById("wins").innerText = wins;
//   document.getElementById("losses").innerText = losses;
//   document.getElementById("draws").innerText = draws;
// }

// function checkAchievements() {
//   const aDiv = document.getElementById("achievement"), msgs = [];
//   if (!achievements.firstWin && wins >= 1) {
//     achievements.firstWin = true;
//     msgs.push("🏆 First Win!");
//   }
//   if (!achievements.fiveWins && wins >= 5) {
//     achievements.fiveWins = true;
//     msgs.push("🏆 5 Wins!");
//   }
//   if (!achievements.firstDraw && draws >= 1) {
//     achievements.firstDraw = true;
//     msgs.push("🤝 First Draw!");
//   }
//   if (!achievements.threeLosses && losses >= 3) {
//     achievements.threeLosses = true;
//     msgs.push("😅 3 Losses!");
//   }

//   if (msgs.length) {
//     aDiv.innerHTML = msgs.join("<br>");
//     setTimeout(() => { aDiv.innerHTML = ""; }, 3000);
//   }
// }

// // ---------- TOGGLE INLINE LEADERBOARD ----------
// const lbBtn = document.getElementById("toggle-leaderboard-btn"),
//       lbDiv = document.querySelector(".leaderboard-inline");

// lbBtn.addEventListener("click", () => {
//   const hidden = getComputedStyle(lbDiv).display === "none";
//   lbDiv.style.display = hidden ? "block" : "none";
//   lbBtn.textContent = hidden ? "Hide Leaderboard" : "Show Leaderboard";
// });



// // ---------- CONFIG & STATE ----------
// const socket = io();
// const choices = ["stone", "paper", "scissor"];
// let mode = null,
//     roomId = "",
//     wins = 0,
//     losses = 0,
//     draws = 0;

// const gameover = new Audio("gameover.mp3"),
//       winSound = new Audio("victory.mp3"),
//       drawSound = new Audio("draw.mp3");

// const winBanter  = ["You're on fire! 🔥","Keep going, champion!","Nice move!","Epic battle!","Unstoppable!"],
//       loseBanter = ["Better luck next time!","Try again!","Close one!","Oops!"],
//       drawBanter = ["Try again!","Even match!","So close!","Neck and neck!"];

// let achievements = {
//   firstWin: false,
//   fiveWins: false,
//   firstDraw: false,
//   threeLosses: false
// };

// // ---------- MODE SELECTION ----------
// function selectMode(selectedMode) {
//   mode = selectedMode;

//   document.getElementById("mode-selection").style.display = "none";
//   document.getElementById("toggle-leaderboard-btn").style.display = "inline-block";
//   document.getElementById("back-button").style.display = "inline-block"; // Show back button

//   if (mode === "bot") {
//     document.getElementById("mode-status").innerText = "Playing vs Computer 🤖";
//     document.getElementById("room-controls").style.display = "none";
//     document.getElementById("game-ui").style.display = "block";
//   } else {
//     document.getElementById("mode-status").innerText = "Online Multiplayer Mode 🌐";
//     document.getElementById("room-controls").style.display = "block";
//     document.getElementById("game-ui").style.display = "none";
//   }
// }

// // ---------- BUTTON HANDLER ----------
// function handleChoice(choice) {
//   if (mode === "bot") playWithBot(choice);
//   else sendChoice(choice);
// }

// // ---------- BOT MODE ----------
// function playWithBot(userChoice) {
//   const comp = choices[Math.floor(Math.random() * choices.length)];
//   const res = getResult(userChoice, comp);
//   showResult(userChoice, comp, res);
// }

// // ---------- ONLINE MODE (Socket.IO) ----------
// function joinRoom() {
//   roomId = document.getElementById("room-id").value.trim();
//   if (!roomId) return alert("Enter room code to join");
//   socket.emit("join-room", roomId);
//   document.getElementById("room-controls").style.display = "none";
//   document.getElementById("status").innerText = "Waiting for opponent...";
// }

// function sendChoice(choice) {
//   if (!roomId) return alert("Join a room first");
//   socket.emit("submit-choice", { roomId, choice });
// }

// socket.on("start-game", () => {
//   document.getElementById("game-ui").style.display = "block";
//   document.getElementById("status").innerText = "Game Started!";
// });

// socket.on("round-result", ({ choices, result }) => {
//   const userChoice = choices[socket.id];
//   const opponentChoice = Object.entries(choices).find(([id]) => id !== socket.id)[1];
//   let finalResult = "It's a draw!";

//   if ((userChoice === "stone" && opponentChoice === "scissor") ||
//       (userChoice === "paper" && opponentChoice === "stone") ||
//       (userChoice === "scissor" && opponentChoice === "paper")) {
//     finalResult = "You win!";
//   } else if (userChoice !== opponentChoice) {
//     finalResult = "You lose!";
//   }

//   showResult(userChoice, opponentChoice, finalResult);
// });

// socket.on("player-left", () => {
//   document.getElementById("status").innerText = "Opponent left the game.";
// });

// // ---------- SHARED LOGIC ----------
// function getResult(u, o) {
//   if (u === o) return "It's a draw!";
//   if ((u === "stone" && o === "scissor") ||
//       (u === "paper" && o === "stone") ||
//       (u === "scissor" && o === "paper")) {
//     return "You win!";
//   }
//   return "You lose!";
// }

// function showResult(u, o, res) {
//   const rd = document.getElementById("result"),
//         bd = document.getElementById("banter"),
//         aDiv = document.getElementById("achievement");

//   let html = `You chose: ${u}<br>Opponent chose: ${o}<br>${res}`;

//   if (res === "You win!") {
//     wins++;
//     winSound.play();
//     html += `<br><img src="excited.gif" style="width:100px;">`;
//   } else if (res === "You lose!") {
//     losses++;
//     gameover.pause(); gameover.currentTime = 0; gameover.play();
//     html += `<br><img src="you lose.png" style="width:80px;">`;
//   } else {
//     draws++;
//     drawSound.play();
//     html += `<br><img src="image.png" style="width:80px;">`;
//   }

//   rd.innerHTML = html;
//   const banterArr = res === "You win!" ? winBanter : res === "You lose!" ? loseBanter : drawBanter;
//   bd.innerText = banterArr[Math.floor(Math.random() * banterArr.length)];

//   updateLeaderboard();
//   checkAchievements();
// }

// function resetGame() {
//   ["result", "banter", "achievement"].forEach(id => {
//     document.getElementById(id).innerText = "";
//   });
//   wins = losses = draws = 0;
//   achievements = {
//     firstWin: false,
//     fiveWins: false,
//     firstDraw: false,
//     threeLosses: false
//   };
//   updateLeaderboard();
// }

// function updateLeaderboard() {
//   document.getElementById("wins").innerText = wins;
//   document.getElementById("losses").innerText = losses;
//   document.getElementById("draws").innerText = draws;
// }

// function checkAchievements() {
//   const aDiv = document.getElementById("achievement"), msgs = [];
//   if (!achievements.firstWin && wins >= 1) {
//     achievements.firstWin = true;
//     msgs.push("🏆 First Win!");
//   }
//   if (!achievements.fiveWins && wins >= 5) {
//     achievements.fiveWins = true;
//     msgs.push("🏆 5 Wins!");
//   }
//   if (!achievements.firstDraw && draws >= 1) {
//     achievements.firstDraw = true;
//     msgs.push("🤝 First Draw!");
//   }
//   if (!achievements.threeLosses && losses >= 3) {
//     achievements.threeLosses = true;
//     msgs.push("😅 3 Losses!");
//   }

//   if (msgs.length) {
//     aDiv.innerHTML = msgs.join("<br>");
//     aDiv.style.display = "block";
//     aDiv.style.animation = "popInOut 3s ease-in-out";
//     setTimeout(() => {
//       aDiv.innerHTML = "";
//       aDiv.style.display = "none";
//     }, 3000);
//   }
// }

// // ---------- TOGGLE INLINE LEADERBOARD ----------
// const lbBtn = document.getElementById("toggle-leaderboard-btn"),
//       lbDiv = document.querySelector(".leaderboard-inline");

// lbBtn.addEventListener("click", () => {
//   const hidden = getComputedStyle(lbDiv).display === "none";
//   lbDiv.style.display = hidden ? "block" : "none";
//   lbBtn.textContent = hidden ? "Hide Leaderboard" : "Show Leaderboard";
// });

// // ---------- BACK BUTTON ----------
// function goBack() {
//   document.getElementById("game-ui").style.display = "none";
//   document.getElementById("room-controls").style.display = "none";
//   document.getElementById("mode-selection").style.display = "flex";
//   document.getElementById("toggle-leaderboard-btn").style.display = "none";
//   document.getElementById("back-button").style.display = "none";
//   resetGame();
// } 


const choices = ["stone", "paper", "scissor"];
let mode = null,
    currentRoomId = null,
    playerId = "",
    localUsername = "Player",
    opponentUsername = "Waiting...",
    wins = 0, losses = 0, draws = 0;

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

window.addEventListener("load", () => {
  const loader = document.getElementById("loading");
  if (loader) loader.style.display = "none";

  const modeSelection = document.getElementById("mode-selection");
  if (modeSelection) modeSelection.style.display = "block";
});

function selectMode(selectedMode) {
  mode = selectedMode;
  document.getElementById("mode-selection").style.display = "none";
  document.getElementById("back-button").style.display = "inline-block";
  document.getElementById("toggle-leaderboard-btn").style.display = "inline-block";

  if (mode === "bot") {
    document.getElementById("mode-status").innerText = "Playing vs Computer 🤖";
    document.getElementById("game-ui").style.display = "block";
    document.getElementById("room-controls").style.display = "none";

    document.getElementById("player-avatar").src = "avtaar1.png";
    document.getElementById("avatar-section").style.display = "block";
    document.getElementById("opponent-avatar-section").style.display = "none";
    document.getElementById("local-username").innerText = localUsername;
    document.getElementById("opponent-username").innerText = "Computer 🤖";
  } else {
    document.getElementById("mode-status").innerText = "Online Multiplayer Mode 🌐";
    document.getElementById("room-controls").style.display = "block";
    document.getElementById("avatar-section").style.display = "none";
    document.getElementById("opponent-avatar-section").style.display = "none";
  }

  showLoader(false); // Clear loader if left on
}

function createRoom() {
  currentRoomId = Math.random().toString(36).substring(2, 8);
  playerId = "player1";
  db.ref(`rooms/${currentRoomId}/players/${playerId}`).set({
    name: localUsername
  });

  showLoader("⏳ Waiting for Player 2 to join...");
  launchGameUI();
  listenToOpponentName(currentRoomId);
}

function joinRoom() {
  const input = document.getElementById("room-id").value.trim();
  if (!input) return alert("Please enter a Room ID");

  currentRoomId = input;
  playerId = "player2";
  db.ref(`rooms/${currentRoomId}/players/${playerId}`).set({
    name: localUsername
  });

  showLoader("🔌 Connecting...");
  launchGameUI();
  listenToOpponentName(currentRoomId);
}

function launchGameUI() {
  document.getElementById("room-controls").style.display = "none";
  document.getElementById("game-ui").style.display = "block";
  document.getElementById("avatar-section").style.display = "block";
  document.getElementById("player-avatar").src = "avtaar1.png";
  document.getElementById("local-username").innerText = localUsername;

  document.getElementById("opponent-avatar-section").style.display = "block";
  document.getElementById("opponent-avatar").src = "avtaar2.png";
  document.getElementById("opponent-username").innerText = opponentUsername;

  document.getElementById("current-room").innerText = currentRoomId;
}

function listenToOpponentName(roomId) {
  db.ref(`rooms/${roomId}/players`).on("value", (snapshot) => {
    const players = snapshot.val();
    for (const id in players) {
      if (id !== playerId && players[id].name) {
        opponentUsername = players[id].name;
        document.getElementById("opponent-username").innerText = opponentUsername;
      }
    }
    showLoader(false); // Hide once opponent joins
  });
}

function toggleProfile() {
  const section = document.getElementById("profile-section");
  section.style.display = section.style.display === "none" ? "block" : "none";
}

function saveProfile() {
  const name = document.getElementById("username-input").value.trim();
  if (name) {
    localUsername = name;
    document.getElementById("local-username").innerText = localUsername;
    if (currentRoomId && playerId) {
      db.ref(`rooms/${currentRoomId}/players/${playerId}/name`).set(localUsername);
    }
  }
  toggleProfile();
}

function showLoader(messageOrFalse) {
  const loader = document.getElementById("loading");
  if (!loader) return;
  if (messageOrFalse) {
    loader.innerText = messageOrFalse;
    loader.style.display = "flex";
  } else {
    loader.innerText = "";
    loader.style.display = "none";
  }
}

function handleChoice(choice) {
  console.log(`${localUsername} chose ${choice}`);
  // Add game logic here (for vs computer or multiplayer)
}

function toggleMusic() {
  const music = document.getElementById("bg-music");
  music.muted = !music.muted;
  document.getElementById("music-toggle-btn").innerText = music.muted ? "🔇 Unmute Music" : "🔊 Mute Music";
}

function goBack() {
  window.location.reload();
}
