// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
let gameRunning = true;
let score = 0;
let gameSpeed = 0;

// Bird object
const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    velocity: 0,
    gravity: 0.4,
    jumpPower: -7,
    color: '#FFD700'
};

// Pipe configuration
const pipeWidth = 60;
const pipeGap = 120;
const pipeDistance = 200;
let pipes = [];

// Initialize pipes
function initPipes() {
    pipes = [];
    for (let i = 0; i < 5; i++) {
        pipes.push({
            x: canvas.width + i * pipeDistance,
            y: Math.random() * (canvas.height - pipeGap - 100) + 50,
            width: pipeWidth,
            passed: false
        });
    }
}

// Draw bird
function drawBird() {
    // Body
    ctx.fillStyle = bird.color;
    ctx.beginPath();
    ctx.arc(bird.x + bird.width / 2, bird.y + bird.height / 2, bird.width / 2, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(bird.x + bird.width / 2 + 5, bird.y + bird.height / 2 - 5, 5, 0, Math.PI * 2);
    ctx.fill();

    // Pupil
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(bird.x + bird.width / 2 + 6, bird.y + bird.height / 2 - 5, 3, 0, Math.PI * 2);
    ctx.fill();

    // Wing
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(bird.x + bird.width / 2 - 8, bird.y + bird.height / 2, 8, 0, Math.PI * 2);
    ctx.stroke();
}

// Draw pipes
function drawPipes() {
    ctx.fillStyle = '#4CAF50';

    for (let pipe of pipes) {
        // Top pipe
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.y);

        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.y + pipeGap, pipe.width, canvas.height - (pipe.y + pipeGap));

        // Pipe borders
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 2;
        ctx.strokeRect(pipe.x, 0, pipe.width, pipe.y);
        ctx.strokeRect(pipe.x, pipe.y + pipeGap, pipe.width, canvas.height - (pipe.y + pipeGap));
    }
}

// Update bird position
function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Boundary collision
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        endGame();
    }
}

// Update pipes
function updatePipes() {
    gameSpeed += 0.0005; // Gradually increase speed
    const speed = 3 + gameSpeed;

    for (let pipe of pipes) {
        pipe.x -= speed;

        // Check if bird passed pipe
        if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
            pipe.passed = true;
            score++;
            document.getElementById('score').textContent = score;
        }

        // Regenerate pipe if it's off screen
        if (pipe.x + pipeWidth < 0) {
            pipe.x = canvas.width + pipeDistance - 20;
            pipe.y = Math.random() * (canvas.height - pipeGap - 100) + 50;
            pipe.passed = false;
        }
    }
}

// Collision detection
function checkCollision() {
    for (let pipe of pipes) {
        const birdLeft = bird.x;
        const birdRight = bird.x + bird.width;
        const birdTop = bird.y;
        const birdBottom = bird.y + bird.height;

        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + pipeWidth;

        // Check horizontal overlap
        if (birdRight > pipeLeft && birdLeft < pipeRight) {
            // Check vertical collision with top pipe
            if (birdTop < pipe.y) {
                endGame();
                return;
            }
            // Check vertical collision with bottom pipe
            if (birdBottom > pipe.y + pipeGap) {
                endGame();
                return;
            }
        }
    }
}

// Draw score
function drawScore() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('Score: ' + score, 20, 50);
}

// Main game loop
function gameLoop() {
    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ground gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (gameRunning) {
        updateBird();
        updatePipes();
        checkCollision();
    }

    drawPipes();
    drawBird();
    drawScore();

    requestAnimationFrame(gameLoop);
}

// End game
function endGame() {
    gameRunning = false;
    document.getElementById('gameOverScreen').classList.remove('hidden');
    document.getElementById('finalScore').textContent = score;
}

// Restart game
function restartGame() {
    gameRunning = true;
    score = 0;
    gameSpeed = 0;
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    document.getElementById('score').textContent = '0';
    document.getElementById('gameOverScreen').classList.add('hidden');
    initPipes();
}

// Input handling
document.addEventListener('click', () => {
    if (gameRunning) {
        bird.velocity = bird.jumpPower;
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (gameRunning) {
            bird.velocity = bird.jumpPower;
        }
    }
});

document.addEventListener('touchstart', () => {
    if (gameRunning) {
        bird.velocity = bird.jumpPower;
    }
});

// Restart button
document.getElementById('restartBtn').addEventListener('click', restartGame);

// Start game
initPipes();
gameLoop();
