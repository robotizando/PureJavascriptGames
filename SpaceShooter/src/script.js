// Variáveis globais do jogo
let gameState = {
    isRunning: false,
    isPaused: false,
    score: 0,
    lives: 3,
    level: 1,
    startTime: 0,
    shotsFired: 0,
    enemiesDestroyed: 0
};

let gameElements = {
    player: null,
    bullets: [],
    enemies: [],
    stars: []
};

let gameSettings = {
    playerSpeed: 6,
    bulletSpeed: 10,
    enemySpeed: 1.5,
    enemySpawnRate: 0.015,
    maxEnemies: 6
};

let keys = {
    left: false,
    right: false,
    up: false,
    down: false,
    space: false
};

// Elementos DOM
const gameArea = document.getElementById('gameArea');
const player = document.getElementById('player');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOver');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const bulletsContainer = document.getElementById('bulletsContainer');
const enemiesContainer = document.getElementById('enemiesContainer');
const starsContainer = document.getElementById('starsContainer');

// Inicialização do jogo
function initGame() {
    createStarField();
    setupEventListeners();
    resetPlayerPosition();
}

// Criar campo de estrelas
function createStarField() {
    starsContainer.innerHTML = '';
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Diferentes tamanhos de estrelas
        const size = Math.random();
        if (size < 0.6) {
            star.classList.add('small');
        } else if (size < 0.9) {
            star.classList.add('medium');
        } else {
            star.classList.add('large');
        }
        
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        
        starsContainer.appendChild(star);
        gameElements.stars.push(star);
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Eventos de teclado
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Botões
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', restartGame);
    
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
            keys.up = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            keys.down = true;
            break;
        case 'Space':
            keys.space = true;
            break;
        case 'KeyP':
            togglePause();
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
            keys.up = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            keys.down = false;
            break;
        case 'Space':
            keys.space = false;
            break;
    }
}

// Iniciar jogo
function startGame() {
    gameState.isRunning = true;
    gameState.startTime = Date.now();
    startScreen.style.display = 'none';
    resetGame();
    gameLoop();
}

// Reiniciar jogo
function restartGame() {
    gameOverScreen.style.display = 'none';
    startGame();
}

// Resetar estado do jogo
function resetGame() {
    gameState.score = 0;
    gameState.lives = 3;
    gameState.level = 1;
    gameState.shotsFired = 0;
    gameState.enemiesDestroyed = 0;
    
    // Limpar elementos
    gameElements.bullets = [];
    gameElements.enemies = [];
    bulletsContainer.innerHTML = '';
    enemiesContainer.innerHTML = '';
    
    resetPlayerPosition();
    updateUI();
}

// Resetar posição do jogador
function resetPlayerPosition() {
    const gameAreaRect = gameArea.getBoundingClientRect();
    player.style.left = (gameAreaRect.width / 2 - 20) + 'px';
    player.style.bottom = '20px';
}

// Pausar/despausar jogo
function togglePause() {
    if (gameState.isRunning) {
        gameState.isPaused = !gameState.isPaused;
    }
}

// Loop principal do jogo
function gameLoop() {
    if (!gameState.isRunning) return;
    
    if (!gameState.isPaused) {
        updatePlayer();
        updateBullets();
        updateEnemies();
        spawnEnemies();
        checkCollisions();
        updateUI();
    }
    
    requestAnimationFrame(gameLoop);
}

// Atualizar jogador
function updatePlayer() {
    const gameAreaRect = gameArea.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();
    const currentLeft = parseInt(player.style.left) || 0;
    const currentBottom = parseInt(player.style.bottom) || 20;
    
    // Movimento horizontal
    if (keys.left && currentLeft > 0) {
        player.style.left = Math.max(0, currentLeft - gameSettings.playerSpeed) + 'px';
    }
    if (keys.right && currentLeft < gameAreaRect.width - 40) {
        player.style.left = Math.min(gameAreaRect.width - 40, currentLeft + gameSettings.playerSpeed) + 'px';
    }
    
    // Movimento vertical
    if (keys.up && currentBottom < gameAreaRect.height - 60) {
        player.style.bottom = Math.min(gameAreaRect.height - 60, currentBottom + gameSettings.playerSpeed) + 'px';
    }
    if (keys.down && currentBottom > 20) {
        player.style.bottom = Math.max(20, currentBottom - gameSettings.playerSpeed) + 'px';
    }
    
    // Disparo
    if (keys.space) {
        shoot();
    }
}

// Disparar projétil
function shoot() {
    const now = Date.now();
    if (!gameElements.lastShot || now - gameElements.lastShot > 150) {
        const bullet = createBullet();
        gameElements.bullets.push(bullet);
        gameElements.lastShot = now;
        gameState.shotsFired++;
    }
}

// Criar projétil
function createBullet() {
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    
    const playerRect = player.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();
    
    bullet.style.left = (playerRect.left - gameAreaRect.left + 18) + 'px';
    bullet.style.bottom = (gameAreaRect.height - (playerRect.top - gameAreaRect.top)) + 'px';
    
    bulletsContainer.appendChild(bullet);
    return bullet;
}

// Atualizar projéteis
function updateBullets() {
    gameElements.bullets = gameElements.bullets.filter(bullet => {
        const currentBottom = parseInt(bullet.style.bottom);
        const newBottom = currentBottom + gameSettings.bulletSpeed;
        
        if (newBottom > gameArea.offsetHeight) {
            bullet.remove();
            return false;
        }
        
        bullet.style.bottom = newBottom + 'px';
        return true;
    });
}

// Gerar inimigos
function spawnEnemies() {
    if (gameElements.enemies.length < gameSettings.maxEnemies && Math.random() < gameSettings.enemySpawnRate) {
        const enemy = createEnemy();
        gameElements.enemies.push(enemy);
    }
}

// Criar inimigo
function createEnemy() {
    const enemy = document.createElement('div');
    enemy.className = 'enemy';
    
    const gameAreaRect = gameArea.getBoundingClientRect();
    enemy.style.left = Math.random() * (gameAreaRect.width - 35) + 'px';
    enemy.style.top = '0px';
    
    enemiesContainer.appendChild(enemy);
    return enemy;
}

// Atualizar inimigos
function updateEnemies() {
    gameElements.enemies = gameElements.enemies.filter(enemy => {
        const currentTop = parseInt(enemy.style.top);
        const newTop = currentTop + gameSettings.enemySpeed;
        
        if (newTop > gameArea.offsetHeight) {
            enemy.remove();
            return false;
        }
        
        enemy.style.top = newTop + 'px';
        return true;
    });
}

// Verificar colisões
function checkCollisions() {
    // Colisão projétil-inimigo
    gameElements.bullets.forEach((bullet, bulletIndex) => {
        gameElements.enemies.forEach((enemy, enemyIndex) => {
            if (isColliding(bullet, enemy)) {
                // Criar explosão
                createExplosion(enemy);
                
                // Remover elementos
                bullet.remove();
                enemy.remove();
                gameElements.bullets.splice(bulletIndex, 1);
                gameElements.enemies.splice(enemyIndex, 1);
                
                // Atualizar pontuação
                gameState.score += 100;
                gameState.enemiesDestroyed++;
                
                // Aumentar dificuldade
                if (gameState.score % 1000 === 0) {
                    levelUp();
                }
            }
        });
    });
    
    // Colisão jogador-inimigo
    gameElements.enemies.forEach((enemy, enemyIndex) => {
        if (isColliding(player, enemy)) {
            // Criar explosão
            createExplosion(player);
            
            // Remover inimigo
            enemy.remove();
            gameElements.enemies.splice(enemyIndex, 1);
            
            // Perder vida
            gameState.lives--;
            
            if (gameState.lives <= 0) {
                gameOver();
            } else {
                // Breve invencibilidade
                player.style.opacity = '0.5';
                setTimeout(() => {
                    player.style.opacity = '1';
                }, 1000);
            }
        }
    });
}

// Verificar colisão entre dois elementos
function isColliding(elem1, elem2) {
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();
    
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}

// Criar efeito de explosão
function createExplosion(element) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    
    const rect = element.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();
    
    explosion.style.left = (rect.left - gameAreaRect.left - 10) + 'px';
    explosion.style.top = (rect.top - gameAreaRect.top - 10) + 'px';
    
    gameArea.appendChild(explosion);
    
    setTimeout(() => {
        explosion.remove();
    }, 300);
}

// Aumentar nível
function levelUp() {
    gameState.level++;
    gameSettings.enemySpawnRate = Math.min(0.04, gameSettings.enemySpawnRate + 0.003);
    gameSettings.enemySpeed = Math.min(3, gameSettings.enemySpeed + 0.15);
    gameSettings.maxEnemies = Math.min(10, gameSettings.maxEnemies + 1);
}

// Fim de jogo
function gameOver() {
    gameState.isRunning = false;
    
    // Calcular estatísticas
    const gameTime = Math.floor((Date.now() - gameState.startTime) / 1000);
    const accuracy = gameState.shotsFired > 0 ? 
        Math.floor((gameState.enemiesDestroyed / gameState.shotsFired) * 100) : 0;
    
    // Atualizar tela de game over
    document.getElementById('finalScore').textContent = gameState.score;
    document.getElementById('gameTime').textContent = gameTime;
    document.getElementById('accuracy').textContent = accuracy;
    
    gameOverScreen.style.display = 'flex';
}

// Atualizar interface
function updateUI() {
    scoreElement.textContent = gameState.score;
    livesElement.textContent = gameState.lives;
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', initGame);

