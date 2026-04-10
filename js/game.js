// Banco de dados do jogo
const database = [

    // LEVES (urbano / rápido)
    { name: "📦 Encomenda Shopee", target: "leves" },
    { name: "💊 Vacinas Urgentes", target: "leves" },
    { name: "🍕 Delivery de Alimentos", target: "leves" },
    { name: "📄 Documentos Expressos", target: "leves" },
    { name: "💻 Equipamentos Eletrônicos", target: "leves" },
    { name: "📦 Pequenos Pacotes", target: "leves" },

    // PESADOS (carga geral / granel)
    { name: "🧱 Carga de Areia", target: "pesados" },
    { name: "⛽ Diesel S10", target: "pesados" },
    { name: "🌽 Milho a Granel", target: "pesados" },
    { name: "🪵 Madeira Serrada", target: "pesados" },
    { name: "🛢️ Óleo Vegetal", target: "pesados" },
    { name: "🚧 Materiais de Construção", target: "pesados" },
    { name: "🚛 Carga Industrial Paletizada", target: "pesados" },

    // ESPECIAIS (cargas especiais / grandes / específicas)
    { name: "🏗️ Peça de Guindaste", target: "especiais" },
    { name: "🚜 Colheitadeira", target: "especiais" },
    { name: "🚗 Transporte de Veículos", target: "especiais" },
    { name: "🏭 Máquina Industrial", target: "especiais" },
    { name: "🚢 Estrutura Metálica Gigante", target: "especiais" },
    { name: "⚙️ Transformador Elétrico", target: "especiais" }

];

let score = 0;
let timeLeft = 60;
let gameRunning = false;
let currentItem = null;
let countdown = null;

// Seletores
const dragItem = document.getElementById('drag-item');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const btnPlay = document.getElementById('btn-play');
const zones = document.querySelectorAll('.zone');

// Sortear carga
function spawnCargo() {
    const random = Math.floor(Math.random() * database.length);
    currentItem = database[random];
    dragItem.textContent = currentItem.name;
    dragItem.style.display = "block";
}

// Iniciar jogo
btnPlay.addEventListener('click', () => {
    score = 0;
    timeLeft = 60;
    gameRunning = true;

    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;

    btnPlay.disabled = true;
    btnPlay.textContent = "Operação em andamento...";

    dragItem.setAttribute('draggable', 'true');
    dragItem.textContent = "Preparando carga...";

    setTimeout(() => {
        spawnCargo();
    }, 500);

    countdown = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            endGame();
        }
    }, 1000);
});

// Finalizar jogo
function endGame() {
    gameRunning = false;
    dragItem.setAttribute('draggable', 'false');
    dragItem.textContent = "Operação finalizada";

    btnPlay.disabled = false;
    btnPlay.textContent = "Jogar Novamente";

    alert("Tempo esgotado! Pontuação: " + score);
}

// Drag
dragItem.addEventListener('dragstart', (e) => {
    if (!gameRunning) return;
    e.dataTransfer.setData('text/plain', currentItem.target);
    dragItem.style.opacity = "0.5";
});

dragItem.addEventListener('dragend', () => {
    dragItem.style.opacity = "1";
});

// Drop zones
zones.forEach(zone => {

    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
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

            // Feedback visual positivo
            zone.style.backgroundColor = "rgba(46, 204, 113, 0.2)";
            setTimeout(() => zone.style.backgroundColor = "", 300);

            spawnCargo();

        } else {
            // Feedback negativo
            zone.style.backgroundColor = "rgba(231, 76, 60, 0.2)";
            setTimeout(() => zone.style.backgroundColor = "", 300);
        }
    });

});