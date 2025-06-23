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


// ---------- CONFIG & STATE ----------
const choices = ["stone", "paper", "scissor"];
let mode = null, roomId = "", playerRole = "";
let wins = 0, losses = 0, draws = 0;

const gameover = new Audio("gameover.mp3"),
      winSound = new Audio("victory.mp3"),
      drawSound = new Audio("draw.mp3");

const winBanter  = ["You're on fire! 🔥","Keep going, champion!","Nice move!","Epic battle!","Unstoppable!"],
      loseBanter = ["Better luck next time!","Try again!","Close one!","Oops!"],
      drawBanter = ["Try again!","Even match!","So close!","Neck and neck!"];

let achievements = {
  firstWin: false,
  fiveWins: false,
  firstDraw: false,
  threeLosses: false
};

// ---------- MODE SELECTION ----------
function selectMode(selectedMode) {
  const bgMusic = document.getElementById("bg-music");
  if (bgMusic) {
    bgMusic.play().catch((err) => {
      console.warn("Music autoplay was blocked:", err);
    });
  } // ✅ Properly close the if block

  mode = selectedMode;
  document.getElementById("mode-selection").style.display = "none";
  document.getElementById("toggle-leaderboard-btn").style.display = "inline-block";
  document.getElementById("back-button").style.display = "inline-block";

  if (mode === "bot") {
    document.getElementById("mode-status").innerText = "Playing vs Computer 🤖";
    document.getElementById("room-controls").style.display = "none";
    document.getElementById("game-ui").style.display = "block";
  } else {
    document.getElementById("mode-status").innerText = "Online Multiplayer Mode 🌐";
    document.getElementById("room-controls").style.display = "block";
    document.getElementById("game-ui").style.display = "none";
  }
}

function goBack() {
  document.getElementById("game-ui").style.display = "none";
  document.getElementById("room-controls").style.display = "none";
  document.getElementById("mode-selection").style.display = "flex";
  document.getElementById("toggle-leaderboard-btn").style.display = "none";
  document.getElementById("back-button").style.display = "none";
  showLoader(false); // ⛔ hides loader if active
  resetGame();
}

// ---------- BUTTON HANDLER ----------
function handleChoice(choice) {
  if (mode === "bot") playWithBot(choice);
  else submitChoice(choice);
}

// ---------- BOT MODE ----------
function playWithBot(userChoice) {
  const comp = choices[Math.floor(Math.random() * choices.length)];
  const res = getResult(userChoice, comp);
  showResult(userChoice, comp, res);
}

// ---------- ONLINE MODE ----------
function createRoom() {
  roomId = document.getElementById("room-id")?.value.trim();
  if (!roomId) return alert("Enter room code to create");

  showLoader("⏳ Waiting for Player 2 to join...");

  db.ref("rooms/" + roomId).set({ player1: null, player2: null }, (error) => {
    if (error) {
      console.error("Failed to create room:", error);
      alert("Failed to create room");
      showLoader(false);
    } else {
      playerRole = "player1";
      launchMultiplayer();
    }
  });
}

function joinRoom() {
  roomId = document.getElementById("room-id").value.trim();
  if (!roomId) return alert("Enter room code to join");

  db.ref("rooms/" + roomId).once("value", snap => {
    if (snap.exists()) {
      playerRole = "player2";
      launchMultiplayer();
    } else {
      alert("Room not found");
    }
  }, error => {
    console.error("Join failed:", error);
    alert("Failed to join: " + error.message);
  });
}

function launchMultiplayer() {
  document.getElementById("room-controls").style.display = "none";
  document.getElementById("game-ui").style.display = "block";
  document.getElementById("player-role-label").style.display = "block";
  document.getElementById("player-role").innerText = playerRole;
  document.getElementById("current-room").innerText = roomId;

  if (playerRole === "player1") {
    showLoader("⏳ Waiting for Player 2 to join...");
  }

  db.ref("rooms/" + roomId).on("value", snap => {
    const data = snap.val();
    if (!data) return;

    const opponent = playerRole === "player1" ? "player2" : "player1";

    if (playerRole === "player1" && data[opponent] !== null) {
      showLoader(false);
    }

    if (data[playerRole] && data[opponent]) {
      showLoader(false);
      const res = getResult(data[playerRole], data[opponent]);
      showResult(data[playerRole], data[opponent], res);
      db.ref("rooms/" + roomId).update({ player1: null, player2: null });
    }
  });
}

function submitChoice(choice) {
  if (!roomId || !playerRole) return alert("Create or join a room first");
  db.ref("rooms/" + roomId + "/" + playerRole).set(choice);
}

// ---------- SHARED LOGIC ----------
function getResult(u, o) {
  if (u === o) return "It's a draw!";
  if ((u === "stone" && o === "scissor") ||
      (u === "paper" && o === "stone") ||
      (u === "scissor" && o === "paper")) {
    return "You win!";
  }
  return "You lose!";
}

function showResult(u, o, res) {
  const rd = document.getElementById("result"),
        bd = document.getElementById("banter");

  let html = `You chose: ${u}<br>Opponent chose: ${o}<br>${res}`;
  if (res === "You win!") {
    wins++;
    winSound.play();
    html += `<br><img src="excited.gif" style="width:100px;">`;
  } else if (res === "You lose!") {
    losses++;
    gameover.pause(); gameover.currentTime = 0; gameover.play();
    html += `<br><img src="you lose.png" style="width:80px;">`;
  } else {
    draws++;
    drawSound.play();
    html += `<br><img src="image.png" style="width:80px;">`;
  }

  rd.innerHTML = html;
  const banterArr = res === "You win!" ? winBanter : res === "You lose!" ? loseBanter : drawBanter;
  bd.innerText = banterArr[Math.floor(Math.random() * banterArr.length)];

  updateLeaderboard();
  checkAchievements();
}

function resetGame() {
  ["result", "banter", "achievement"].forEach(id => {
    document.getElementById(id).innerText = "";
  });
  wins = losses = draws = 0;
  achievements = {
    firstWin: false,
    fiveWins: false,
    firstDraw: false,
    threeLosses: false
  };
  updateLeaderboard();
}

function updateLeaderboard() {
  document.getElementById("wins").innerText = wins;
  document.getElementById("losses").innerText = losses;
  document.getElementById("draws").innerText = draws;
}

function checkAchievements() {
  const aDiv = document.getElementById("achievement"),
        msgs = [];
  if (!achievements.firstWin && wins >= 1) {
    achievements.firstWin = true;
    msgs.push("🏆 First Win!");
  }
  if (!achievements.fiveWins && wins >= 5) {
    achievements.fiveWins = true;
    msgs.push("🏆 5 Wins!");
  }
  if (!achievements.firstDraw && draws >= 1) {
    achievements.firstDraw = true;
    msgs.push("🤝 First Draw!");
  }
  if (!achievements.threeLosses && losses >= 3) {
    achievements.threeLosses = true;
    msgs.push("😅 3 Losses!");
  }

  if (msgs.length) {
    aDiv.innerHTML = msgs.join("<br>");
    setTimeout(() => { aDiv.innerHTML = ""; }, 3000);
  }
}

// ---------- LOADING INDICATOR ----------
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

// ---------- RESET LOADER ON PAGE LOAD ----------
window.addEventListener("load", () => {
  showLoader(false);
});

// ---------- TOGGLE INLINE LEADERBOARD ----------
const lbBtn = document.getElementById("toggle-leaderboard-btn"),
      lbDiv = document.querySelector(".leaderboard-inline");

lbBtn.addEventListener("click", () => {
  const hidden = getComputedStyle(lbDiv).display === "none";
  lbDiv.style.display = hidden ? "block" : "none";
  lbBtn.textContent = hidden ? "Hide Leaderboard" : "Show Leaderboard";
});

// ---------- MUSIC TOGGLE ----------
function toggleMusic() {
  const bgMusic = document.getElementById("bg-music");
  const btn = document.getElementById("music-toggle-btn");

  if (bgMusic.paused) {
    bgMusic.play();
    btn.textContent = "🔊 Mute Music";
  } else {
    bgMusic.pause();
    btn.textContent = "🔇 Unmute Music";
  }
}
document.querySelectorAll('.emoji').forEach(emoji => {
  emoji.addEventListener('click', () => {
    emoji.classList.add('clicked');
    setTimeout(() => {
      emoji.classList.remove('clicked');
    }, 300); // Reset after animation
  });
});

