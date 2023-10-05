// Game configuration
var gameConfig = {
    width: 800,
    height: 400,
    gravity: 0.2,
    jumpForce: -7,
    playerSize: 40,
    obstacleSize: 40,
    obstacleSpeed: 3,
    spikeGroupProbability: 0.3 // Probability of spawning a group of spikes (30%)
};

// Game variables
var game;
var player;
var obstacles = [];
var isJumping = false;
var gameOver = false;
var updateInterval;
var obstacleInterval;

// Game initialization
function init() {
    game = document.getElementById("game");
    game.style.width = gameConfig.width + "px";
    game.style.height = gameConfig.height + "px";
    player = createPlayer(gameConfig.width / 2, gameConfig.height - gameConfig.playerSize);
    game.appendChild(player);

    updateInterval = setInterval(update, 10);
    obstacleInterval = setInterval(spawnObstacle, 2000);

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    createResetButton();
}

// Update game state
function update() {
    if (!gameOver) {
        movePlayer();
        moveObstacles();
        checkCollision();
    }
}

// Create player element
function createPlayer(x, y) {
    var player = document.createElement("div");
    player.style.position = "absolute";
    player.style.width = gameConfig.playerSize + "px";
    player.style.height = gameConfig.playerSize + "px";
    player.style.background = "red";
    player.style.left = x + "px";
    player.style.top = y + "px";
    return player;
}

// Move player
function movePlayer() {
    var y = parseFloat(player.style.top);
    var vy = parseFloat(player.getAttribute("data-vy")) || 0;

    if (isJumping && vy === 0) {
        vy = gameConfig.jumpForce;
    }

    vy += gameConfig.gravity;
    y += vy;

    if (y > gameConfig.height - gameConfig.playerSize) {
        y = gameConfig.height - gameConfig.playerSize;
        vy = 0;
    }

    player.style.top = y + "px";
    player.setAttribute("data-vy", vy);
}

// Handle keydown event
function handleKeyDown(event) {
    if (event.code === "Space") {
        isJumping = true;
    }
}

// Handle keyup event
function handleKeyUp(event) {
    if (event.code === "Space") {
        isJumping = false;
    }
}

// Create obstacle element
function createObstacle(x) {
    var obstacle = document.createElement("div");
    obstacle.style.position = "absolute";
    obstacle.style.width = gameConfig.obstacleSize + "px";
    obstacle.style.height = gameConfig.obstacleSize + "px";
    obstacle.style.background = "green";
    obstacle.style.left = x + "px";
    obstacle.style.top = gameConfig.height - gameConfig.obstacleSize + "px";
    return obstacle;
}

// Spawn obstacle
function spawnObstacle() {
    var x = gameConfig.width - gameConfig.obstacleSize;

    // Determine if a group of spikes should be spawned
    if (Math.random() < gameConfig.spikeGroupProbability) {
        var spikeCount = getRandomInt(2, 3); // Random number of spikes between 2 and 3
        var spikeGap = gameConfig.obstacleSize / (spikeCount - 1);
        var spikesXPositions = [];

        for (var i = 0; i < spikeCount; i++) {
            spikesXPositions.push(x + i * spikeGap);
        }

        for (var j = 0; j < spikeCount; j++) {
            var obstacle = createObstacle(spikesXPositions[j]);
            obstacles.push(obstacle);
            game.appendChild(obstacle);
        }
    } else {
        var obstacle = createObstacle(x);
        obstacles.push(obstacle);
        game.appendChild(obstacle);
    }
}

// Helper function to get a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Move obstacles
function moveObstacles() {
    for (var i = 0; i < obstacles.length; i++) {
        var obstacle = obstacles[i];
        var x = parseFloat(obstacle.style.left);
        x -= gameConfig.obstacleSpeed;
        obstacle.style.left = x + "px";

        if (x < -gameConfig.obstacleSize) {
            game.removeChild(obstacle);
            obstacles.splice(i, 1);
            i--;
        }
    }
}

// Check collision
function checkCollision() {
    var playerRect = player.getBoundingClientRect();

    for (var i = 0; i < obstacles.length; i++) {
        var obstacleRect = obstacles[i].getBoundingClientRect();

        if (playerRect.left < obstacleRect.right &&
            playerRect.right > obstacleRect.left &&
            playerRect.top < obstacleRect.bottom &&
            playerRect.bottom > obstacleRect.top) {
            gameOver = true;
            showGameOver();
            break; // Exit the loop after the first collision
        }
    }
}

// Show "Game Over" message and reset button
function showGameOver() {
    var gameOverMessage = document.createElement("div");
    gameOverMessage.style.position = "absolute";
    gameOverMessage.style.width = "100%";
    gameOverMessage.style.height = "100%";
    gameOverMessage.style.background = "rgba(0, 0, 0, 0.5)";
    gameOverMessage.style.display = "flex";
    gameOverMessage.style.alignItems = "center";
    gameOverMessage.style.justifyContent = "center";
    gameOverMessage.style.color = "white";
    gameOverMessage.style.fontSize = "24px";
    gameOverMessage.innerText = "Game Over";

    var resetButton = document.createElement("button");
    resetButton.innerText = "Reset";
    resetButton.addEventListener("click", resetGame);

    gameOverMessage.appendChild(resetButton);
    game.appendChild(gameOverMessage);
}

// Reset the game
function resetGame() {
    clearInterval(updateInterval);
    clearInterval(obstacleInterval);
    game.innerHTML = "";
    obstacles = [];
    isJumping = false;
    gameOver = false;
    init();
}

// Create reset button
function createResetButton() {
    var resetButton = document.createElement("button");
    resetButton.innerText = "Reset";
    resetButton.style.position = "absolute";
    resetButton.style.right = "10px";
    resetButton.style.bottom = "10px";
    resetButton.addEventListener("click", resetGame);

    game.appendChild(resetButton);
}

// Initialize the game
init();
