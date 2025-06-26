const choices = ["rock", "paper", "scissors"];
let localUsername = "";
let opponentUsername = "Opponent";
let playerScore = 0;
let botScore = 0;
let selectedAvatar = "";
let mode = ""; // "bot" or "multiplayer"
let currentRoomId = "";
const socket = io();

// --- UI Handlers ---

function showSection(id) {
  document.querySelectorAll("section").forEach((section) => {
    section.style.display = "none";
  });
  document.getElementById(id).style.display = "block";
}

function setAvatar(avatar) {
  selectedAvatar = avatar;
  document.getElementById("selected-avatar").src = avatar;
  document.getElementById("confirm-avatar").style.display = "inline-block";
}

function startGame() {
  localUsername = document.getElementById("username").value.trim();
  if (!localUsername) {
    alert("Please enter a username.");
    return;
  }
  showSection("mode-selection");
}

function selectMode(selectedMode) {
  mode = selectedMode;
  if (mode === "bot") {
    showSection("avatar-selection");
  } else {
    showSection("room-selection");
  }
}

function confirmAvatar() {
  document.getElementById("player-avatar").src = selectedAvatar;
  document.getElementById("local-username").innerText = localUsername;
  if (mode === "bot") {
    showSection("game-ui");
    document.getElementById("avatar-section").style.display = "block";
    document.getElementById("opponent-avatar-section").style.display = "block";
    document.getElementById("opponent-avatar").src = "avtaar2.png";
    document.getElementById("opponent-username").innerText = opponentUsername;
  } else {
    socket.emit("join-room", currentRoomId);
    showLoader("⏳ Waiting for opponent...");
  }
}

function createRoom() {
  const roomInput = document.getElementById("room-id").value.trim();
  if (!roomInput) {
    alert("Please enter a room code (password) to create a room.");
    return;
  }
  currentRoomId = roomInput;
  showLoader("⏳ Waiting for Player 2 to join...");
  socket.emit("join-room", roomInput);
}

function joinRoom() {
  const roomInput = document.getElementById("room-id").value.trim();
  if (!roomInput) {
    alert("Please enter the room code (password) to join.");
    return;
  }
  currentRoomId = roomInput;
  showLoader("🔌 Connecting...");
  socket.emit("join-room", roomInput);
}

function handleChoice(choice) {
  if (mode === "bot") {
    const botChoice = choices[Math.floor(Math.random() * choices.length)];
    showResult(localUsername, choice, opponentUsername, botChoice);
  } else {
    socket.emit("submit-choice", { roomId: currentRoomId, choice });
  }
}

function showResult(player1, choice1, player2, choice2) {
  let resultText = "";
  if (choice1 === choice2) {
    resultText = "It's a tie!";
  } else if (
    (choice1 === "rock" && choice2 === "scissors") ||
    (choice1 === "scissors" && choice2 === "paper") ||
    (choice1 === "paper" && choice2 === "rock")
  ) {
    resultText = `${player1} wins!`;
    if (player1 === localUsername) playerScore++;
    else botScore++;
  } else {
    resultText = `${player2} wins!`;
    if (player2 === localUsername) playerScore++;
    else botScore++;
  }

  document.getElementById("result").innerText = resultText;
  document.getElementById("score").innerText = `${localUsername}: ${playerScore} | ${opponentUsername}: ${botScore}`;
}

function goBack() {
  playerScore = 0;
  botScore = 0;
  localUsername = "";
  selectedAvatar = "";
  document.getElementById("username").value = "";
  document.getElementById("room-id").value = "";
  document.getElementById("result").innerText = "";
  document.getElementById("score").innerText = "";
  document.getElementById("selected-avatar").src = "";
  document.getElementById("confirm-avatar").style.display = "none";
  showSection("start");
}

function showLoader(text) {
  const loader = document.getElementById("loader");
  if (text) {
    loader.innerText = text;
    loader.style.display = "block";
    document.getElementById("room-controls").style.display = "none";
  } else {
    loader.style.display = "none";
  }
}

// --- Socket.IO Listeners ---

socket.on("start-game", () => {
  document.getElementById("room-controls").style.display = "none";
  document.getElementById("game-ui").style.display = "block";
  document.getElementById("avatar-section").style.display = "block";
  document.getElementById("opponent-avatar-section").style.display = "block";

  document.getElementById("player-avatar").src = selectedAvatar;
  document.getElementById("local-username").innerText = localUsername;
  document.getElementById("opponent-username").innerText = opponentUsername;
  document.getElementById("opponent-avatar").src = "avtaar2.png"; // Placeholder avatar

  showLoader(false);
});

socket.on("round-result", ({ choices, result }) => {
  const ids = Object.keys(choices);
  const [id1, id2] = ids;
  const yourId = socket.id;
  const yourChoice = choices[yourId];
  const oppId = ids.find((id) => id !== yourId);
  const oppChoice = choices[oppId];

  showResult(localUsername, yourChoice, opponentUsername, oppChoice);
});

socket.on("player-left", () => {
  alert("Opponent left the game.");
  goBack();
});
