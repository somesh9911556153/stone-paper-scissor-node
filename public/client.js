// // ---------- CONFIG & STATE ----------
// const choices = ["stone", "paper", "scissor"];
// let mode = null,
//   currentRoomId = null,
//   playerRole = "",
//   localUsername = "Player",
//   selectedAvatar = "avtaar1.png",
//   wins = 0,
//   losses = 0,
//   draws = 0;

// let roomJoined = false;
// let musicPlaying = false;

// const gameover = new Audio("gameover.mp3"),
//   winSound = new Audio("victory.mp3"),
//   drawSound = new Audio("draw.mp3");

// // ---------- MUSIC ----------
// function toggleMusic() {
//   const music = document.getElementById('bg-music');
//   if (music.paused) {
//     music.play();
//     document.getElementById('music-toggle-btn').textContent = "🔇 Mute Music";
//     musicPlaying = true;
//   } else {
//     music.pause();
//     document.getElementById('music-toggle-btn').textContent = "🔊 Play Music";
//     musicPlaying = false;
//   }
// }

// window.addEventListener('click', () => {
//   if (!musicPlaying) {
//     document.getElementById('bg-music').play().catch(() => {});
//     musicPlaying = true;
//   }
// }, { once: true });

// // ---------- SET PROFILE ----------
// function saveProfile() {
//   const usernameInput = document.getElementById('profile-username').value.trim();
//   const selectedAvatarElement = document.querySelector('.avatar-option.selected');
//   if (!usernameInput || !selectedAvatarElement) {
//     alert("Please enter a username and select an avatar.");
//     return;
//   }
//   localUsername = usernameInput;
//   selectedAvatar = selectedAvatarElement.getAttribute('data-avatar');
//   localStorage.setItem('username', localUsername);
//   localStorage.setItem('avatar', selectedAvatar);
//   document.getElementById('profile-username-label').innerText = localUsername;
//   document.getElementById('profile-display-avatar').src = selectedAvatar;
//   closeProfileModal();
// }

// document.querySelectorAll(".avatar-option").forEach(img => {
//   img.addEventListener("click", () => {
//     document.querySelectorAll(".avatar-option").forEach(i => i.classList.remove("selected"));
//     img.classList.add("selected");
//   });
// });

// // ---------- MODE SELECTION ----------
// function selectMode(selectedMode) {
//   mode = selectedMode;
//   document.getElementById('mode-selection').style.display = 'none';
//   document.getElementById('profile-display').style.display = 'none';
//   document.getElementById('toggle-leaderboard-btn').style.display = 'none';
//   document.getElementById('back-button').style.display = 'block';

//   if (mode === "bot") {
//     startGameVsComputer();
//     document.getElementById('opponent-username').textContent = 'Computer 🤖';
//     document.getElementById('opponent-avatar-inline').src = 'bot.png';
//   } else {
//     document.getElementById("room-controls").style.display = "block";
//   }
// }

// // ---------- PLAY VS BOT ----------
// function startGameVsComputer() {
//   document.getElementById("game-ui").style.display = "block";
//   document.getElementById("local-username").innerText = localUsername;
//   document.getElementById("player-avatar-inline").src = selectedAvatar;
//   document.getElementById("opponent-username").innerText = "Computer 🤖";
//   document.getElementById("opponent-avatar-inline").src = "bot.png";
//   document.getElementById("toggle-leaderboard-btn").style.display = "block";
// }

// // ---------- FIREBASE ROOM LOGIC ----------
// function createRoom() {
//   const roomId = Math.random().toString(36).substr(2, 6);
//   const roomRef = firebase.database().ref("rooms/" + roomId);

//   document.getElementById("loading").style.display = "flex";
//   roomRef.set({
//     player1: { name: localUsername, move: null, avatar: selectedAvatar },
//     player2: null
//   }).then(() => {
//     currentRoomId = roomId;
//     playerRole = "player1";
//     roomJoined = true;
//     const currentRoomElem = document.getElementById("current-room");
//     if (currentRoomElem) currentRoomElem.innerText = roomId;
//     document.getElementById("loading").style.display = "none";
//     startOnlineGame();
//     listenToRoom(roomId);
//   }).catch(err => {
//     console.error("Room creation failed:", err);
//     document.getElementById("loading").style.display = "none";
//     alert("Error creating room.");
//   });
// }

// function joinRoom() {
//   const roomId = document.getElementById("room-id").value.trim();
//   document.getElementById("loading").style.display = "flex";
//   firebase.database().ref("rooms/" + roomId).once("value").then(snapshot => {
//     if (snapshot.exists() && !snapshot.val().player2) {
//       firebase.database().ref("rooms/" + roomId + "/player2").set({
//         name: localUsername,
//         move: null,
//         avatar: selectedAvatar
//       });
//       currentRoomId = roomId;
//       playerRole = "player2";
//       roomJoined = true;
//       const currentRoomElem = document.getElementById("current-room");
//       if (currentRoomElem) currentRoomElem.innerText = roomId;
//       document.getElementById("loading").style.display = "none";
//       startOnlineGame();
//       listenToRoom(roomId);
//     } else {
//       alert("Room not found or already full.");
//       document.getElementById("loading").style.display = "none";
//     }
//   });
// }

// function startOnlineGame() {
//   document.getElementById("game-ui").style.display = "block";
//   document.getElementById("local-username").innerText = localUsername;
//   document.getElementById("player-avatar-inline").src = selectedAvatar;
//   document.getElementById("toggle-leaderboard-btn").style.display = "block";
// }

// function listenToRoom(roomId) {
//   firebase.database().ref("rooms/" + roomId).on("value", snapshot => {
//     const room = snapshot.val();
//     if (!room) return;
//     const me = room[playerRole];
//     const opponentRole = playerRole === "player1" ? "player2" : "player1";
//     const opponent = room[opponentRole];

//     if (opponent) {
//       document.getElementById("opponent-username").innerText = opponent.name;
//       document.getElementById("opponent-avatar-inline").src = opponent.avatar;
//     }

//     if (me?.move && opponent?.move) {
//       checkResult(me.move, opponent.move);
//     }
//   });
// }

// // ---------- GAME LOGIC ----------
// function handleChoice(choice) {
//   if (mode === "bot") {
//     const botChoice = choices[Math.floor(Math.random() * 3)];
//     checkResult(choice, botChoice);
//   } else {
//     firebase.database().ref(`rooms/${currentRoomId}/${playerRole}/move`).set(choice);
//   }
// }

// function checkResult(p1, p2) {
//   let resultText = "";
//   let gif = "";
//   if (p1 === p2) {
//     resultText = "It's a draw!";
//     gif = '<img src="image.png" alt="Draw" style="width:100px;">';
//     drawSound.play();
//     draws++;
//   } else if ((p1 === "stone" && p2 === "scissor") || (p1 === "paper" && p2 === "stone") || (p1 === "scissor" && p2 === "paper")) {
//     resultText = "You win!";
//     gif = '<img src="excited.gif" alt="Win" style="width:100px;">';
//     winSound.play();
//     wins++;
//   } else {
//     resultText = "You lose!";
//     gif = '<img src="you lose.png" alt="Lose" style="width:100px;">';
//     gameover.play();
//     losses++;
//   }
//   document.getElementById("result").innerHTML = resultText + "<br>" + gif;
//   document.getElementById("wins").innerText = wins;
//   document.getElementById("losses").innerText = losses;
//   document.getElementById("draws").innerText = draws;
//   updateLeaderboard();
// }

// function resetGame() {
//   if (mode === "bot") {
//     document.getElementById("result").innerText = "";
//     return;
//   }
//   firebase.database().ref(`rooms/${currentRoomId}/player1/move`).set(null);
//   firebase.database().ref(`rooms/${currentRoomId}/player2/move`).set(null);
//   document.getElementById("result").innerText = "";
// }

// // ---------- LEADERBOARD ----------
// function updateLeaderboard() {
//   const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
//   const idx = leaderboard.findIndex(entry => entry.name === localUsername);
//   const entry = { name: localUsername, wins, losses, draws, avatar: selectedAvatar };
//   if (idx >= 0) leaderboard[idx] = entry;
//   else leaderboard.push(entry);
//   localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
//   renderLeaderboard();
// }

// function renderLeaderboard() {
//   const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
//   leaderboard.sort((a, b) => b.wins - a.wins || a.losses - b.losses);
//   let html = "";
//   leaderboard.forEach(entry => {
//     html += `<tr>
//       <td><img src="${entry.avatar}" style="width:32px;height:32px;border-radius:50%;"></td>
//       <td>${entry.name}</td>
//       <td>${entry.wins}</td>
//       <td>${entry.losses}</td>
//       <td>${entry.draws}</td>
//     </tr>`;
//   });
//   document.getElementById("leaderboard-table").innerHTML = html;
// }

// function showLeaderboard() {
//   renderLeaderboard();
//   document.getElementById("leaderboard-modal").style.display = "block";
// }

// function closeLeaderboard() {
//   document.getElementById("leaderboard-modal").style.display = "none";
// }

// window.addEventListener('DOMContentLoaded', () => {
//   const storedUsername = localStorage.getItem('username');
//   const storedAvatar = localStorage.getItem('avatar');
//   if (storedUsername && storedAvatar) {
//     localUsername = storedUsername;
//     selectedAvatar = storedAvatar;
//     document.getElementById('profile-username-label').innerText = localUsername;
//     document.getElementById('profile-display-avatar').src = selectedAvatar;
//   }
// });

// function goBack() {
//   document.getElementById("game-ui").style.display = "none";
//   document.getElementById("room-controls").style.display = "none";
//   document.getElementById("mode-selection").style.display = "block";
//   document.getElementById("back-button").style.display = "none";
//   document.getElementById("profile-display").style.display = "flex";
//   document.getElementById("toggle-leaderboard-btn").style.display = "none";
//   document.getElementById("leaderboard-modal").style.display = "none";
//   document.getElementById('result').innerHTML = '';
//   document.getElementById('banter').innerHTML = '';
//   document.getElementById('achievement').innerHTML = '';
// }

// function openProfileModal() {
//   document.getElementById('profile-modal').style.display = 'block';
// }

// function closeProfileModal() {
//   document.getElementById('profile-modal').style.display = 'none';
// }






const choices = ["stone", "paper", "scissor"];
let mode = null,
  currentRoomId = null,
  playerRole = "",
  localUsername = "Player",
  selectedAvatar = "avtaar1.png",
  wins = 0,
  losses = 0,
  draws = 0,
  roomJoined = false;

let musicPlaying = false;
const gameover = new Audio("gameover.mp3"),
  winSound = new Audio("victory.mp3"),
  drawSound = new Audio("draw.mp3");

function toggleMusic() {
  const music = document.getElementById('bg-music');
  if (!music) return;
  if (music.paused) {
    music.play();
    document.getElementById('music-toggle-btn').textContent = "🔇 Mute Music";
    musicPlaying = true;
  } else {
    music.pause();
    document.getElementById('music-toggle-btn').textContent = "🔊 Play Music";
    musicPlaying = false;
  }
}

window.addEventListener('click', () => {
  if (!musicPlaying) {
    const music = document.getElementById('bg-music');
    if (music) music.play().catch(() => {});
    musicPlaying = true;
  }
}, { once: true });

function saveProfile() {
  const usernameInput = document.getElementById('profile-username').value.trim();
  const selectedAvatarElement = document.querySelector('.avatar-option.selected');
  if (!usernameInput || !selectedAvatarElement) {
    alert("Please enter a username and select an avatar.");
    return;
  }
  localUsername = usernameInput;
  selectedAvatar = selectedAvatarElement.getAttribute('data-avatar');
  localStorage.setItem('username', localUsername);
  localStorage.setItem('avatar', selectedAvatar);
  document.getElementById('profile-username-label').innerText = localUsername;
  document.getElementById('profile-display-avatar').src = selectedAvatar;
  closeProfileModal();
}

document.querySelectorAll(".avatar-option").forEach(img => {
  img.addEventListener("click", () => {
    document.querySelectorAll(".avatar-option").forEach(i => i.classList.remove("selected"));
    img.classList.add("selected");
  });
});

function selectMode(selectedMode) {
  mode = selectedMode;
  document.getElementById('mode-selection').style.display = 'none';
  document.getElementById('profile-display').style.display = 'none';
  document.getElementById('toggle-leaderboard-btn').style.display = 'none';
  document.getElementById('back-button').style.display = 'block';

  if (mode === "bot") {
    startGameVsComputer();
    document.getElementById('opponent-username').textContent = 'Computer 🤖';
    document.getElementById('opponent-avatar-inline').src = 'bot.png';
  } else {
    document.getElementById("room-controls").style.display = "block";
  }
}

function startGameVsComputer() {
  document.getElementById("game-ui").style.display = "block";
  document.getElementById("local-username").innerText = localUsername;
  document.getElementById("player-avatar-inline").src = selectedAvatar;
  document.getElementById("opponent-username").innerText = "Computer 🤖";
  document.getElementById("opponent-avatar-inline").src = "bot.png";
  document.getElementById("toggle-leaderboard-btn").style.display = "block";
}

function createRoom() {
  const roomId = Math.random().toString(36).substr(2, 6).toLowerCase();
  document.getElementById("loading").style.display = "flex";
  roomJoined = false;

  firebase.database().ref("rooms/" + roomId).set({
    player1: { name: localUsername, move: null, avatar: selectedAvatar },
    player2: null
  }).then(() => {
    currentRoomId = roomId;
    playerRole = "player1";
    roomJoined = true;
    document.getElementById("loading").style.display = "none";
    document.getElementById("current-room").innerText = `Room Code: ${roomId}`;
    startOnlineGame();
    listenToRoom(roomId);
  }).catch(err => {
    console.error("Room creation error:", err);
    alert("Could not create room.");
    document.getElementById("loading").style.display = "none";
  });
}

function joinRoom() {
  const roomId = document.getElementById("room-id").value.trim().toLowerCase();
  if (!roomId) return alert("Please enter a valid room code.");
  document.getElementById("loading").style.display = "flex";

  firebase.database().ref("rooms/" + roomId).once("value").then(snapshot => {
    const room = snapshot.val();
    if (room && !room.player2) {
      firebase.database().ref(`rooms/${roomId}/player2`).set({
        name: localUsername,
        move: null,
        avatar: selectedAvatar
      }).then(() => {
        currentRoomId = roomId;
        playerRole = "player2";
        roomJoined = true;
        document.getElementById("loading").style.display = "none";
        document.getElementById("current-room").innerText = `Room Code: ${roomId}`;
        startOnlineGame();
        listenToRoom(roomId);
      });
    } else {
      alert("Room not found or already full.");
      document.getElementById("loading").style.display = "none";
    }
  }).catch(err => {
    alert("Error joining room.");
    console.error(err);
    document.getElementById("loading").style.display = "none";
  });
}

function startOnlineGame() {
  document.getElementById("game-ui").style.display = "block";
  document.getElementById("local-username").innerText = localUsername;
  document.getElementById("player-avatar-inline").src = selectedAvatar;
  document.getElementById("toggle-leaderboard-btn").style.display = "block";
}

function listenToRoom(roomId) {
  firebase.database().ref("rooms/" + roomId).on("value", snapshot => {
    const room = snapshot.val();
    if (!room) return;

    const me = room[playerRole];
    const opponentRole = playerRole === "player1" ? "player2" : "player1";
    const opponent = room[opponentRole];

    if (opponent) {
      document.getElementById("opponent-username").innerText = opponent.name;
      document.getElementById("opponent-avatar-inline").src = opponent.avatar;
    }

    if (me?.move && opponent?.move) {
      checkResult(me.move, opponent.move);
      firebase.database().ref(`rooms/${roomId}/player1/move`).set(null);
      firebase.database().ref(`rooms/${roomId}/player2/move`).set(null);
    }
  });
}

function handleChoice(choice) {
  if (mode === "bot") {
    const botChoice = choices[Math.floor(Math.random() * 3)];
    checkResult(choice, botChoice);
  } else {
    firebase.database().ref(`rooms/${currentRoomId}/${playerRole}/move`).set(choice);
  }
}

function checkResult(p1, p2) {
  let resultText = "";
  let gif = "";

  if (p1 === p2) {
    resultText = "It's a draw!";
    gif = '<img src="image.png" alt="Draw" style="width:100px;">';
    drawSound.play();
    draws++;
  } else if ((p1 === "stone" && p2 === "scissor") || (p1 === "paper" && p2 === "stone") || (p1 === "scissor" && p2 === "paper")) {
    resultText = "You win!";
    gif = '<img src="excited.gif" alt="Win" style="width:100px;">';
    winSound.play();
    wins++;
  } else {
    resultText = "You lose!";
    gif = '<img src="you lose.png" alt="Lose" style="width:100px;">';
    gameover.play();
    losses++;
  }

  document.getElementById("result").innerHTML = resultText + "<br>" + gif;
  document.getElementById("wins").innerText = wins;
  document.getElementById("losses").innerText = losses;
  document.getElementById("draws").innerText = draws;

  updateLeaderboard();
}

function resetGame() {
  if (mode === "bot") {
    document.getElementById("result").innerText = "";
    return;
  }
  firebase.database().ref(`rooms/${currentRoomId}/player1/move`).set(null);
  firebase.database().ref(`rooms/${currentRoomId}/player2/move`).set(null);
  document.getElementById("result").innerText = "";
}

function updateLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  const idx = leaderboard.findIndex(entry => entry.name === localUsername);
  const entry = { name: localUsername, wins, losses, draws, avatar: selectedAvatar };
  if (idx >= 0) leaderboard[idx] = entry;
  else leaderboard.push(entry);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  renderLeaderboard();
}

function renderLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  leaderboard.sort((a, b) => b.wins - a.wins || a.losses - b.losses);
  let html = `<tr><th>Avatar</th><th>Name</th><th>Wins</th><th>Losses</th><th>Draws</th></tr>`;
  leaderboard.forEach(entry => {
    html += `<tr>
      <td><img src="${entry.avatar}" style="width:32px;height:32px;border-radius:50%;"></td>
      <td>${entry.name}</td>
      <td>${entry.wins}</td>
      <td>${entry.losses}</td>
      <td>${entry.draws}</td>
    </tr>`;
  });
  document.getElementById("leaderboard-table").innerHTML = html;
}

function showLeaderboard() {
  document.getElementById("leaderboard-modal").style.display = "block";
  renderLeaderboard();
}

function closeLeaderboard() {
  document.getElementById("leaderboard-modal").style.display = "none";
}

window.addEventListener('DOMContentLoaded', () => {
  const storedUsername = localStorage.getItem('username');
  const storedAvatar = localStorage.getItem('avatar');
  if (storedUsername && storedAvatar) {
    localUsername = storedUsername;
    selectedAvatar = storedAvatar;
    document.getElementById('profile-username-label').innerText = localUsername;
    document.getElementById('profile-display-avatar').src = selectedAvatar;
  }
});

function goBack() {
  document.getElementById("game-ui").style.display = "none";
  document.getElementById("room-controls").style.display = "none";
  document.getElementById("mode-selection").style.display = "block";
  document.getElementById("back-button").style.display = "none";
  document.getElementById("profile-display").style.display = "flex";
  document.getElementById("toggle-leaderboard-btn").style.display = "none";
  document.getElementById("leaderboard-modal").style.display = "none";
  document.getElementById('result').innerHTML = '';
  document.getElementById('banter').innerHTML = '';
  document.getElementById('achievement').innerHTML = '';
}

function openProfileModal() {
  document.getElementById('profile-modal').style.display = 'block';
}

function closeProfileModal() {
  document.getElementById('profile-modal').style.display = 'none';
}

