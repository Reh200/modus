// Banco de dados do jogo
const database = [
    { name: "📦 Encomenda Shopee", target: "leves" },
    { name: "💊 Vacinas Urgentes", target: "leves" },
    { name: "🧱 Carga de Areia", target: "pesados" },
    { name: "⛽ Diesel S10", target: "pesados" },
    { name: "🏗️ Peça de Guindaste", target: "especiais" },
    { name: "🚜 Colheitadeira", target: "especiais" }
];

let score = 0;
let timeLeft = 30;
let gameRunning = false;
let currentItem = null;

// Seletores
const dragItem = document.getElementById('drag-item');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const btnPlay = document.getElementById('btn-play');
const zones = document.querySelectorAll('.zone');

// Função para sortear nova carga
function spawnCargo() {
    const random = Math.floor(Math.random() * database.length);
    currentItem = database[random];
    dragItem.textContent = currentItem.name;
    dragItem.style.display = "block";
}

// Iniciar Jogo
btnPlay.addEventListener('click', () => {
    score = 0;
    timeLeft = 30;
    gameRunning = true;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    btnPlay.disabled = true;
    dragItem.setAttribute('draggable', 'true');
    
    spawnCargo();

    const countdown = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            endGame();
        }
    }, 1000);
});

function endGame() {
    gameRunning = false;
    dragItem.setAttribute('draggable', 'false');
    dragItem.textContent = "Fim de Jogo!";
    btnPlay.disabled = false;
    btnPlay.textContent = "Jogar Novamente";
    alert("Tempo esgotado! Sua pontuação: " + score);
}

// Lógica de Drag and Drop
dragItem.addEventListener('dragstart', (e) => {
    if (!gameRunning) return;
    e.dataTransfer.setData('text/plain', currentItem.target);
    dragItem.style.opacity = "0.5";
});

dragItem.addEventListener('dragend', () => {
    dragItem.style.opacity = "1";
});

zones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault(); // Necessário para permitir o drop
        zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        
        if (!gameRunning) return;

        const droppedTarget = e.dataTransfer.getData('text/plain');
        const zoneTarget = zone.getAttribute('data-target');

        if (droppedTarget === zoneTarget) {
            score += 10;
            scoreDisplay.textContent = score;
            spawnCargo(); // Gera o próximo item
        } else {
            // Penalidade de tempo ou apenas erro visual
            zone.style.backgroundColor = "rgba(231, 76, 60, 0.2)";
            setTimeout(() => zone.style.backgroundColor = "", 300);
        }
    });
});