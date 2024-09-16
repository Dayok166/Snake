const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20; // Size of each grid cell
const tileCount = canvas.width / gridSize;

let snakeX = Math.floor(tileCount / 2);
let snakeY = Math.floor(tileCount / 2);
let velocityX = 0;
let velocityY = 0;
let snakeTrail = [];
let tailLength = 4;

let appleX = Math.floor(Math.random() * tileCount);
let appleY = Math.floor(Math.random() * tileCount);

let score = 0;
let gameSpeed = 100; // Initial game speed
let gameInterval;

function gameLoop() {
  snakeX += velocityX;
  snakeY += velocityY;

  // Wrap snake position on edge
  if (snakeX < 0) {
    snakeX = tileCount - 1;
  }
  if (snakeX >= tileCount) {
    snakeX = 0;
  }
  if (snakeY < 0) {
    snakeY = tileCount - 1;
  }
  if (snakeY >= tileCount) {
    snakeY = 0;
  }

  // Background
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Apple (food)
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(
    appleX * gridSize + gridSize / 2,
    appleY * gridSize + gridSize / 2,
    (gridSize - 2) / 2,
    0,
    2 * Math.PI
  );
  ctx.fill();

  // Snake
  for (let i = 0; i < snakeTrail.length; i++) {
    if (i === snakeTrail.length - 1) {
      // Draw head
      drawSnakeHead(snakeTrail[i].x, snakeTrail[i].y);
    } else if (i === 0) {
      // Draw tail
      drawSnakeTail(snakeTrail[i].x, snakeTrail[i].y);
    } else {
      // Draw body
      drawSnakeBody(snakeTrail[i].x, snakeTrail[i].y);
    }

    // Check collision with self
    if (
      snakeTrail[i].x === snakeX &&
      snakeTrail[i].y === snakeY &&
      i !== snakeTrail.length - 1
    ) {
      // Reset game
      resetGame();
    }
  }

  snakeTrail.push({ x: snakeX, y: snakeY });
  while (snakeTrail.length > tailLength) {
    snakeTrail.shift();
  }

  // Check collision with apple
  if (appleX === snakeX && appleY === snakeY) {
    tailLength++;
    score++;
    document.getElementById("scoreBoard").innerText = "Score: " + score;
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);

    // Increase game speed
    increaseSpeed();
  }
}

// Function to draw snake head
function drawSnakeHead(x, y) {
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.arc(
    x * gridSize + gridSize / 2,
    y * gridSize + gridSize / 2,
    gridSize / 2,
    0,
    2 * Math.PI
  );
  ctx.fill();

  // Add eyes
  ctx.fillStyle = "white";
  let eyeOffsetX = velocityX === 0 ? gridSize / 5 : 0;
  let eyeOffsetY = velocityY === 0 ? gridSize / 5 : 0;
  let eyeX = x * gridSize + gridSize / 2 + eyeOffsetX * velocityX;
  let eyeY = y * gridSize + gridSize / 2 + eyeOffsetY * velocityY;
  ctx.beginPath();
  ctx.arc(
    eyeX - gridSize / 5,
    eyeY - gridSize / 5,
    gridSize / 10,
    0,
    2 * Math.PI
  );
  ctx.arc(
    eyeX + gridSize / 5,
    eyeY - gridSize / 5,
    gridSize / 10,
    0,
    2 * Math.PI
  );
  ctx.fill();
}

// Function to draw snake body
function drawSnakeBody(x, y) {
  ctx.fillStyle = "darkgreen";
  ctx.beginPath();
  ctx.rect(x * gridSize + 2, y * gridSize + 2, gridSize - 4, gridSize - 4);
  ctx.fill();
}

// Function to draw snake tail
function drawSnakeTail(x, y) {
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.arc(
    x * gridSize + gridSize / 2,
    y * gridSize + gridSize / 2,
    gridSize / 2 - 2,
    0,
    2 * Math.PI
  );
  ctx.fill();
}

// Function to reset the game
function resetGame() {
  tailLength = 4;
  score = 0;
  document.getElementById("scoreBoard").innerText = "Score: " + score;
  velocityX = 0;
  velocityY = 0;
  snakeX = Math.floor(tileCount / 2);
  snakeY = Math.floor(tileCount / 2);
  snakeTrail = [];
  gameSpeed = 100;
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, gameSpeed);
}

// Function to increase game speed
function increaseSpeed() {
  if (gameSpeed > 20) {
    // Set a minimum speed limit
    gameSpeed -= 5; // Increase speed by decreasing interval time
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, gameSpeed);
  }
}

// Key controls
document.addEventListener("keydown", keyPush);

function keyPush(event) {
  switch (event.keyCode) {
    case 37: // Left arrow
      if (velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
      }
      break;
    case 38: // Up arrow
      if (velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
      }
      break;
    case 39: // Right arrow
      if (velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
      }
      break;
    case 40: // Down arrow
      if (velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
      }
      break;
  }
}

// Start the game loop
gameInterval = setInterval(gameLoop, gameSpeed);
