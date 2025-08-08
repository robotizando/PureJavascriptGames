// Variáveis globais do jogo
let gameState = {
    isRunning: false,
    isPaused: false,
    score: 0,
    lives: 3,
    level: 1,
    startTime: 0,
    coinsCollected: 0,
    totalCoins: 0
};

let gameElements = {
    player: null,
    platforms: [],
    coins: [],
    enemies: [],
    particles: []
};

let gameSettings = {
    gravity: 0.6,
    jumpPower: -12,
    playerSpeed: 4,
    enemySpeed: 1.5,
    maxFallSpeed: 12,
    platformWidth: 120,
    platformHeight: 20
};

let player = {
    x: 100,
    y: 400,
    width: 32,
    height: 32,
    velocityX: 0,
    velocityY: 0,
    onGround: false,
    direction: 1 // 1 = direita, -1 = esquerda
};

let keys = {
    left: false,
    right: false,
    up: false,
    space: false,
    p: false
};

let camera = {
    x: 0,
    y: 0
};

// Elementos DOM
const gameArea = document.getElementById('gameArea');
const playerElement = document.getElementById('player');
const platformsContainer = document.getElementById('platformsContainer');
const collectiblesContainer = document.getElementById('collectiblesContainer');
const enemiesContainer = document.getElementById('enemiesContainer');
const particlesContainer = document.getElementById('particlesContainer');

const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const levelElement = document.getElementById('level');

const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOver');
const levelCompleteScreen = document.getElementById('levelComplete');
const pauseScreen = document.getElementById('pauseScreen');

const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const nextLevelBtn = document.getElementById('nextLevelBtn');

// Inicialização do jogo
function initGame() {
    setupEventListeners();
    resetPlayer();
    createLevel(gameState.level);
    updateUI();
}

// Configurar event listeners
function setupEventListeners() {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', restartGame);
    nextLevelBtn.addEventListener('click', nextLevel);
    
    // Prevenir scroll da página
    document.addEventListener('keydown', (e) => {
        if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);
}

// Manipulação de teclas
function handleKeyDown(e) {
    switch(e.code) {
        case 'ArrowLeft':
        case 'KeyA':
            keys.left = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            keys.right = true;
            break;
        case 'ArrowUp':
        case 'KeyW':
        case 'Space':
            keys.up = true;
            break;
        case 'KeyP':
            if (gameState.isRunning) {
                togglePause();
            }
            break;
    }
}

function handleKeyUp(e) {
    switch(e.code) {
        case 'ArrowLeft':
        case 'KeyA':
            keys.left = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            keys.right = false;
            break;
        case 'ArrowUp':
        case 'KeyW':
        case 'Space':
            keys.up = false;
            break;
    }
}

// Iniciar jogo
function startGame() {
    gameState.isRunning = true;
    gameState.startTime = Date.now();
    startScreen.style.display = 'none';
    gameLoop();
}

// Reiniciar jogo
function restartGame() {
    gameState = {
        isRunning: false,
        isPaused: false,
        score: 0,
        lives: 3,
        level: 1,
        startTime: 0,
        coinsCollected: 0,
        totalCoins: 0
    };
    
    resetPlayer();
    clearLevel();
    createLevel(1);
    updateUI();
    gameOverScreen.style.display = 'none';
    startGame();
}

// Próximo nível
function nextLevel() {
    gameState.level++;
    gameState.lives = Math.min(gameState.lives + 1, 5); // Bônus de vida
    
    resetPlayer();
    clearLevel();
    createLevel(gameState.level);
    updateUI();
    levelCompleteScreen.style.display = 'none';
    gameState.isRunning = true;
}

// Pausar/despausar
function togglePause() {
    gameState.isPaused = !gameState.isPaused;
    pauseScreen.style.display = gameState.isPaused ? 'flex' : 'none';
}

// Reset do jogador
function resetPlayer() {
    player.x = 100;
    player.y = 400;
    player.velocityX = 0;
    player.velocityY = 0;
    player.onGround = false;
    player.direction = 1;
    updatePlayerPosition();
}

// Criar nível
function createLevel(level) {
    clearLevel();
    
    // Plataformas básicas
    const platforms = [
        { x: 0, y: 550, width: 200, height: 20 },
        { x: 300, y: 450, width: 120, height: 20 },
        { x: 500, y: 350, width: 120, height: 20 },
        { x: 700, y: 250, width: 120, height: 20 },
        { x: 900, y: 400, width: 120, height: 20 },
        { x: 1100, y: 300, width: 120, height: 20 },
        { x: 1300, y: 200, width: 120, height: 20 },
        { x: 1500, y: 450, width: 200, height: 20 }
    ];
    
    // Adicionar mais plataformas baseado no nível
    for (let i = 0; i < level; i++) {
        platforms.push({
            x: 1700 + (i * 300),
            y: 300 + Math.sin(i) * 100,
            width: 120,
            height: 20
        });
    }
    
    // Criar plataformas
    platforms.forEach(platformData => {
        createPlatform(platformData.x, platformData.y, platformData.width, platformData.height);
    });
    
    // Criar moedas
    const coinPositions = [
        { x: 350, y: 400 },
        { x: 550, y: 300 },
        { x: 750, y: 200 },
        { x: 950, y: 350 },
        { x: 1150, y: 250 },
        { x: 1350, y: 150 },
        { x: 1550, y: 400 }
    ];
    
    // Adicionar mais moedas baseado no nível
    for (let i = 0; i < level * 2; i++) {
        coinPositions.push({
            x: 1800 + (i * 200),
            y: 200 + Math.random() * 200
        });
    }
    
    coinPositions.forEach(coinData => {
        createCoin(coinData.x, coinData.y);
    });
    
    // Criar inimigos
    const enemyPositions = [
        { x: 320, y: 420, range: 40 },
        { x: 720, y: 220, range: 80 },
        { x: 1120, y: 270, range: 100 }s
    ];
    
    // Adicionar mais inimigos baseado no nível
    for (let i = 0; i < Math.floor(level / 2); i++) {
        enemyPositions.push({
            x: 1600 + (i * 400),
            y: 300 + Math.random() * 100,
            range: 80 + Math.random() * 40
        });
    }
    
    enemyPositions.forEach(enemyData => {
        createEnemy(enemyData.x, enemyData.y, enemyData.range);
    });
    
    gameState.totalCoins = gameElements.coins.length;
}

// Criar plataforma
function createPlatform(x, y, width, height) {
    const platform = document.createElement('div');
    platform.className = 'platform';
    platform.style.left = x + 'px';
    platform.style.top = y + 'px';
    platform.style.width = width + 'px';
    platform.style.height = height + 'px';
    
    platformsContainer.appendChild(platform);
    gameElements.platforms.push({
        element: platform,
        x: x,
        y: y,
        width: width,
        height: height
    });
}

// Criar moeda
function createCoin(x, y) {
    const coin = document.createElement('div');
    coin.className = 'coin';
    coin.style.left = x + 'px';
    coin.style.top = y + 'px';
    
    collectiblesContainer.appendChild(coin);
    gameElements.coins.push({
        element: coin,
        x: x,
        y: y,
        width: 20,
        height: 20,
        collected: false
    });
}

// Criar inimigo
function createEnemy(x, y, range) {
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    enemy.style.left = x + 'px';
    enemy.style.top = y + 'px';
    
    enemiesContainer.appendChild(enemy);
    gameElements.enemies.push({
        element: enemy,
        x: x,
        y: y,
        width: 28,
        height: 28,
        startX: x,
        range: range,
        direction: 1,
        speed: gameSettings.enemySpeed
    });
}

// Limpar nível
function clearLevel() {
    platformsContainer.innerHTML = '';
    collectiblesContainer.innerHTML = '';
    enemiesContainer.innerHTML = '';
    particlesContainer.innerHTML = '';
    
    gameElements.platforms = [];
    gameElements.coins = [];
    gameElements.enemies = [];
    gameElements.particles = [];
}

// Loop principal do jogo
function gameLoop() {
    if (!gameState.isRunning) return;
    
    if (!gameState.isPaused) {
        updatePlayer();
        updateEnemies();
        updateCamera();
        checkCollisions();
        updateParticles();
        checkLevelComplete();
    }
    
    requestAnimationFrame(gameLoop);
}

// Atualizar jogador
function updatePlayer() {
    // Movimento horizontal
    if (keys.left) {
        player.velocityX = -gameSettings.playerSpeed;
        player.direction = -1;
        playerElement.classList.add('moving-left');
    } else if (keys.right) {
        player.velocityX = gameSettings.playerSpeed;
        player.direction = 1;
        playerElement.classList.remove('moving-left');
    } else {
        player.velocityX *= 0.8; // Atrito
    }
    
    // Pulo
    if (keys.up && player.onGround) {
        player.velocityY = gameSettings.jumpPower;
        player.onGround = false;
        playerElement.classList.add('jumping');
        createJumpParticles();
    }
    
    // Gravidade
    if (!player.onGround) {
        player.velocityY += gameSettings.gravity;
        if (player.velocityY > gameSettings.maxFallSpeed) {
            player.velocityY = gameSettings.maxFallSpeed;
        }
    }
    
    // Atualizar posição
    player.x += player.velocityX;
    player.y += player.velocityY;
    
    // Limites da tela (apenas esquerda)
    if (player.x < 0) {
        player.x = 0;
        player.velocityX = 0;
    }
    
    // Verificar queda
    if (player.y > 600) {
        loseLife();
    }
    
    updatePlayerPosition();
}

// Atualizar posição visual do jogador
function updatePlayerPosition() {
    playerElement.style.left = (player.x - camera.x) + 'px';
    playerElement.style.top = player.y + 'px';
    
    if (player.onGround) {
        playerElement.classList.remove('jumping');
    }
}

// Atualizar inimigos
function updateEnemies() {
    gameElements.enemies.forEach(enemy => {
        // Movimento de patrulha
        enemy.x += enemy.direction * enemy.speed;
        
        // Inverter direção nos limites
        if (enemy.x <= enemy.startX - enemy.range || enemy.x >= enemy.startX + enemy.range) {
            enemy.direction *= -1;
        }
        
        // Atualizar posição visual
        enemy.element.style.left = (enemy.x - camera.x) + 'px';
    });
}

// Atualizar câmera
function updateCamera() {
    // Seguir o jogador horizontalmente
    const targetCameraX = player.x - window.innerWidth / 2;
    camera.x = Math.max(0, targetCameraX);
    
    // Atualizar posição de todos os elementos
    gameElements.platforms.forEach(platform => {
        platform.element.style.left = (platform.x - camera.x) + 'px';
    });
    
    gameElements.coins.forEach(coin => {
        if (!coin.collected) {
            coin.element.style.left = (coin.x - camera.x) + 'px';
        }
    });
}

// Verificar colisões
function checkCollisions() {
    player.onGround = false;
    
    // Colisão com plataformas
    gameElements.platforms.forEach(platform => {
        if (isColliding(player, platform)) {
            // Colisão por cima (jogador pousando na plataforma)
            if (player.velocityY > 0 && player.y < platform.y) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.onGround = true;
            }
            // Colisão por baixo (jogador batendo a cabeça)
            else if (player.velocityY < 0 && player.y > platform.y) {
                player.y = platform.y + platform.height;
                player.velocityY = 0;
            }
            // Colisão lateral
            else if (player.velocityX !== 0) {
                if (player.x < platform.x) {
                    player.x = platform.x - player.width;
                } else {
                    player.x = platform.x + platform.width;
                }
                player.velocityX = 0;
            }
        }
    });
    
    // Colisão com moedas
    gameElements.coins.forEach(coin => {
        if (!coin.collected && isColliding(player, coin)) {
            collectCoin(coin);
        }
    });
    
    // Colisão com inimigos
    gameElements.enemies.forEach(enemy => {
        if (isColliding(player, enemy)) {
            loseLife();
        }
    });
}

// Verificar colisão entre dois objetos
function isColliding(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Coletar moeda
function collectCoin(coin) {
    coin.collected = true;
    coin.element.style.display = 'none';
    
    gameState.score += 100;
    gameState.coinsCollected++;
    
    createCollectParticles(coin.x, coin.y);
    updateUI();
}

// Perder vida
function loseLife() {
    gameState.lives--;
    updateUI();
    
    if (gameState.lives <= 0) {
        gameOver();
    } else {
        resetPlayer();
        screenShake();
    }
}

// Fim de jogo
function gameOver() {
    gameState.isRunning = false;
    
    const gameTime = Math.floor((Date.now() - gameState.startTime) / 1000);
    
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('gameTime').textContent = gameTime;
    document.getElementById('coinsCollected').textContent = gameState.coinsCollected;
    
    gameOverScreen.style.display = 'flex';
}

// Verificar se o nível foi completado
function checkLevelComplete() {
    if (gameState.coinsCollected >= gameState.totalCoins) {
        levelComplete();
    }
}

// Nível completo
function levelComplete() {
    gameState.isRunning = false;
    
    const timeBonus = Math.max(0, 1000 - Math.floor((Date.now() - gameState.startTime) / 1000) * 10);
    gameState.score += timeBonus;
    
    document.getElementById('levelScore').textContent = gameState.score;
    document.getElementById('timeBonus').textContent = timeBonus;
    
    levelCompleteScreen.style.display = 'flex';
}

// Criar partículas de pulo
function createJumpParticles() {
    for (let i = 0; i < 5; i++) {
        createParticle(
            player.x + Math.random() * player.width,
            player.y + player.height,
            (Math.random() - 0.5) * 4,
            Math.random() * -3,
            '#87CEEB'
        );
    }
}

// Criar partículas de coleta
function createCollectParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        createParticle(
            x + 10,
            y + 10,
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
            '#FFD700'
        );
    }
}

// Criar partícula
function createParticle(x, y, vx, vy, color) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = (x - camera.x) + 'px';
    particle.style.top = y + 'px';
    particle.style.background = color;
    
    particlesContainer.appendChild(particle);
    
    const particleData = {
        element: particle,
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        life: 30
    };
    
    gameElements.particles.push(particleData);
}

// Atualizar partículas
function updateParticles() {
    gameElements.particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.2; // Gravidade nas partículas
        particle.life--;
        
        particle.element.style.left = (particle.x - camera.x) + 'px';
        particle.element.style.top = particle.y + 'px';
        particle.element.style.opacity = particle.life / 30;
        
        if (particle.life <= 0) {
            particle.element.remove();
            gameElements.particles.splice(index, 1);
        }
    });
}

// Efeito de tremor da tela
function screenShake() {
    gameArea.classList.add('screen-shake');
    setTimeout(() => {
        gameArea.classList.remove('screen-shake');
    }, 500);
}

// Atualizar interface
function updateUI() {
    scoreElement.textContent = gameState.score;
    livesElement.textContent = gameState.lives;
    levelElement.textContent = gameState.level;
}

// Inicializar quando a página carregar
window.addEventListener('load', initGame);

