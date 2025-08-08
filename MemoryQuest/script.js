// Estado global do jogo
let gameState = {
    isRunning: false,
    isPaused: false,
    startTime: null,
    elapsedTime: 0,
    attempts: 0,
    pairs: 0,
    totalPairs: 8,
    difficulty: 'medium',
    flippedCards: [],
    matchedCards: [],
    canFlip: true,
    timer: null
};

// Símbolos para as cartas (emojis)
const cardSymbols = {
    easy: ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎪', '🎯'],
    medium: ['🚀', '⭐', '🌙', '☀️', '🌈', '⚡', '🔥', '💎'],
    hard: ['🦄', '🐉', '🦋', '🐙', '🦊', '🐺', '🦁', '🐯', '🐸', '🐢', '🦜', '🦚', '🐝', '🐞', '🦗', '🕷️', '🦀', '🐠']
};

// Elementos DOM
const gameBoard = document.getElementById('gameBoard');
const timerElement = document.getElementById('timer');
const attemptsElement = document.getElementById('attempts');
const pairsElement = document.getElementById('pairs');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const difficultySelect = document.getElementById('difficulty');
const startScreen = document.getElementById('startScreen');
const victoryScreen = document.getElementById('victoryScreen');
const pauseScreen = document.getElementById('pauseScreen');
const particlesContainer = document.getElementById('particlesContainer');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    showStartScreen();
});

// Configurar event listeners
function setupEventListeners() {
    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', restartGame);
    difficultySelect.addEventListener('change', changeDifficulty);
    
    // Teclas de atalho
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (gameState.isRunning && !gameState.isPaused) {
                pauseGame();
            } else if (gameState.isPaused) {
                resumeGame();
            }
        }
        if (e.key === 'r' || e.key === 'R') {
            if (gameState.isRunning) {
                restartGame();
            }
        }
    });
}

// Mostrar tela inicial
function showStartScreen() {
    hideAllOverlays();
    startScreen.classList.add('active');
    gameState.isRunning = false;
    gameState.isPaused = false;
    clearInterval(gameState.timer);
}

// Iniciar jogo
function startGame() {
    hideAllOverlays();
    initializeGame();
    createBoard();
    startTimer();
    
    gameState.isRunning = true;
    gameState.isPaused = false;
    startBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block';
}

// Inicializar estado do jogo
function initializeGame() {
    gameState.startTime = Date.now();
    gameState.elapsedTime = 0;
    gameState.attempts = 0;
    gameState.pairs = 0;
    gameState.flippedCards = [];
    gameState.matchedCards = [];
    gameState.canFlip = true;
    
    // Configurar dificuldade
    const difficulty = difficultySelect.value;
    gameState.difficulty = difficulty;
    
    if (difficulty === 'easy') {
        gameState.totalPairs = 8;
        gameBoard.className = 'game-board';
    } else if (difficulty === 'medium') {
        gameState.totalPairs = 8;
        gameBoard.className = 'game-board';
    } else if (difficulty === 'hard') {
        gameState.totalPairs = 18;
        gameBoard.className = 'game-board hard';
    }
    
    updateUI();
}

// Criar tabuleiro
function createBoard() {
    gameBoard.innerHTML = '';
    
    const symbols = cardSymbols[gameState.difficulty];
    const pairs = gameState.totalPairs;
    
    // Criar array de cartas (cada símbolo aparece duas vezes)
    let cards = [];
    for (let i = 0; i < pairs; i++) {
        cards.push(symbols[i], symbols[i]);
    }
    
    // Embaralhar cartas
    cards = shuffleArray(cards);
    
    // Criar elementos das cartas
    cards.forEach((symbol, index) => {
        const card = createCard(symbol, index);
        gameBoard.appendChild(card);
    });
}

// Criar uma carta
function createCard(symbol, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.symbol = symbol;
    card.dataset.index = index;
    
    card.innerHTML = `
        <div class="card-face card-back"></div>
        <div class="card-face card-front">
            <span class="card-symbol">${symbol}</span>
        </div>
    `;
    
    card.addEventListener('click', () => flipCard(card));
    
    return card;
}

// Virar carta
function flipCard(card) {
    if (!gameState.canFlip || 
        card.classList.contains('flipped') || 
        card.classList.contains('matched') ||
        !gameState.isRunning ||
        gameState.isPaused) {
        return;
    }
    
    card.classList.add('flipped');
    gameState.flippedCards.push(card);
    
    if (gameState.flippedCards.length === 2) {
        gameState.canFlip = false;
        gameState.attempts++;
        updateUI();
        
        setTimeout(() => {
            checkMatch();
        }, 1000);
    }
}

// Verificar se as cartas formam um par
function checkMatch() {
    const [card1, card2] = gameState.flippedCards;
    const symbol1 = card1.dataset.symbol;
    const symbol2 = card2.dataset.symbol;
    
    if (symbol1 === symbol2) {
        // Par encontrado
        card1.classList.add('matched');
        card2.classList.add('matched');
        gameState.matchedCards.push(card1, card2);
        gameState.pairs++;
        
        // Criar efeito de partículas
        createMatchParticles(card1);
        createMatchParticles(card2);
        
        // Verificar vitória
        if (gameState.pairs === gameState.totalPairs) {
            setTimeout(() => {
                endGame();
            }, 500);
        }
    } else {
        // Não é um par - desvirar cartas
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 500);
    }
    
    gameState.flippedCards = [];
    gameState.canFlip = true;
    updateUI();
}

// Criar efeito de partículas
function createMatchParticles(card) {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const angle = (i / 12) * Math.PI * 2;
        const distance = 50 + Math.random() * 30;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 2000);
    }
}

// Finalizar jogo
function endGame() {
    gameState.isRunning = false;
    clearInterval(gameState.timer);
    
    // Calcular estatísticas finais
    const finalTime = formatTime(gameState.elapsedTime);
    const accuracy = Math.round((gameState.totalPairs / gameState.attempts) * 100);
    
    // Atualizar tela de vitória
    document.getElementById('finalTime').textContent = finalTime;
    document.getElementById('finalAttempts').textContent = gameState.attempts;
    document.getElementById('accuracy').textContent = accuracy + '%';
    
    // Mostrar tela de vitória
    setTimeout(() => {
        victoryScreen.classList.add('active');
    }, 1000);
}

// Pausar jogo
function pauseGame() {
    if (!gameState.isRunning || gameState.isPaused) return;
    
    gameState.isPaused = true;
    clearInterval(gameState.timer);
    pauseScreen.classList.add('active');
}

// Retomar jogo
function resumeGame() {
    if (!gameState.isPaused) return;
    
    gameState.isPaused = false;
    hideAllOverlays();
    startTimer();
}

// Reiniciar jogo
function restartGame() {
    hideAllOverlays();
    clearInterval(gameState.timer);
    startGame();
}

// Mudar dificuldade
function changeDifficulty() {
    if (gameState.isRunning) {
        restartGame();
    }
}

// Iniciar cronômetro
function startTimer() {
    gameState.timer = setInterval(() => {
        if (!gameState.isPaused) {
            gameState.elapsedTime = Date.now() - gameState.startTime;
            updateUI();
        }
    }, 100);
}

// Atualizar interface
function updateUI() {
    timerElement.textContent = formatTime(gameState.elapsedTime);
    attemptsElement.textContent = gameState.attempts;
    pairsElement.textContent = `${gameState.pairs}/${gameState.totalPairs}`;
}

// Formatar tempo
function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Embaralhar array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Esconder todos os overlays
function hideAllOverlays() {
    document.querySelectorAll('.overlay').forEach(overlay => {
        overlay.classList.remove('active');
    });
}

// Funções globais para os botões dos overlays
window.startGame = startGame;
window.restartGame = restartGame;
window.showStartScreen = showStartScreen;
window.resumeGame = resumeGame;

