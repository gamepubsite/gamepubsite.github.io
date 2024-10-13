const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const player = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    width: 50,
    height: 50,
    speed: 5
};

const apple = {
    x: Math.random() * (canvas.width - 20),
    y: 0,
    width: 20,
    height: 20,
    speed: 3
};

let score = 0;

// Key states
const keys = {};

// Event listeners
document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    // Move player
    if (keys['ArrowLeft'] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys['ArrowRight'] && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }

    // Move apple
    apple.y += apple.speed;

    // Check collision
    if (
        player.x < apple.x + apple.width &&
        player.x + player.width > apple.x &&
        player.y < apple.y + apple.height &&
        player.y + player.height > apple.y
    ) {
        score++;
        resetApple();
    }

    // Reset apple if it goes off screen
    if (apple.y > canvas.height) {
        resetApple();
    }
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw apple
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x, apple.y, apple.width, apple.height);

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function resetApple() {
    apple.x = Math.random() * (canvas.width - apple.width);
    apple.y = 0;
}

// Start the game
gameLoop();
