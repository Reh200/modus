/**
 * MODUS GAME - LOGÍSTICA EM AÇÃO
 * Banco de dados completo de veículos e cargas
 */

const cargos = [
    // --- CATEGORIA: LEVES (Utilitários) ---
    { name: "📦 50 Caixas de E-commerce", type: "leves" },
    { name: "🍕 20 Pizzas para Entrega", type: "leves" },
    { name: "💊 Medicamentos Urgentes", type: "leves" },
    { name: "📄 Documentos de Cartório", type: "leves" },
    { name: "🍞 Pães Frescos (Padaria)", type: "leves" },

    // --- CATEGORIA: PESADOS (Trucks e Carretas) ---
    { name: "🌾 30 Toneladas de Milho", type: "pesados" },
    { name: "⛽ 40mil Litros de Diesel", type: "pesados" },
    { name: "🧱 5.000 Tijolos Baianos", type: "pesados" },
    { name: "🥤 20 Paletes de Refrigerante", type: "pesados" },
    { name: "🥩 Carnes Congeladas", type: "pesados" },
    { name: "🧻 Carga de Papel Higiênico", type: "pesados" },

    // --- CATEGORIA: ESPECIAIS (Pranchas e Cegonhas) ---
    { name: "🚜 Trator de Colheita", type: "especiais" },
    { name: "🚗 11 Carros Sedan Zero KM", type: "especiais" },
    { name: "🔋 Pá de Turbina Eólica", type: "especiais" },
    { name: "🏗️ Peça de Guindaste Industrial", type: "especiais" },
    { name: "🛥️ Lancha de Luxo 30 pés", type: "especiais" },
    { name: "🔨 Escavadeira Hidráulica", type: "especiais" }
];

let score = 0;
let timeLeft = 30;
let gameActive = false;
let currentCargo = null;
let timerInterval;

const dragItem = document.getElementById('drag-item');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const btnPlay = document.getElementById('btn-play');
const zones = document.querySelectorAll('.zone');

// Função de Início
btnPlay.addEventListener('click', () => {
    if (!gameActive) {
        score = 0;
        timeLeft = 30;
        gameActive = true;
        scoreDisplay.innerText = score;
        timerDisplay.innerText = timeLeft;
        btnPlay.style.display = 'none';
        
        nextRound();
        
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.innerText = timeLeft;
            if (timeLeft <= 0) endGame();
        }, 1000);
    }
});

function nextRound() {
    if (!gameActive) return;
    
    // Sorteia uma carga nova que seja diferente da anterior
    let nextCargo;
    do {
        nextCargo = cargos[Math.floor(Math.random() * cargos.length)];
    } while (nextCargo === currentCargo);

    currentCargo = nextCargo;
    dragItem.innerText = currentCargo.name;
    dragItem.draggable = true;
    
    // Pequena animação de "surgimento"
    dragItem.style.transform = "scale(0.8)";
    setTimeout(() => dragItem.style.transform = "scale(1)", 50);
}

// Configuração do Drag & Drop
dragItem.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', currentCargo.type);
    dragItem.style.opacity = "0.5";
});

dragItem.addEventListener('dragend', () => {
    dragItem.style.opacity = "1";
});

zones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('hover');
    });

    zone.addEventListener('dragleave', () => {
        zone.classList.remove('hover');
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('hover');
        
        if (!gameActive) return;

        const droppedType = e.dataTransfer.getData('text/plain');
        const targetType = zone.getAttribute('data-target');

        if (droppedType === targetType) {
            score += 10;
            scoreDisplay.innerText = score;
            // Efeito visual de sucesso
            zone.style.borderColor = "#2ecc71";
            setTimeout(() => zone.style.borderColor = "transparent", 400);
            nextRound();
        } else {
            score = Math.max(0, score - 5);
            scoreDisplay.innerText = score;
            // Efeito visual de erro
            zone.style.borderColor = "#e74c3c";
            setTimeout(() => zone.style.borderColor = "transparent", 400);
        }
    });
});

function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    dragItem.draggable = false;
    dragItem.innerText = "Fim do Turno!";
    btnPlay.style.display = 'inline-block';
    btnPlay.innerText = "Reiniciar Operação";
    
    let rank = "";
    if(score >= 100) rank = "Diretor de Logística 🏆";
    else if(score >= 50) rank = "Gerente de Frota 🚛";
    else rank = "Ajudante de Carga 📦";

    alert(`Tempo esgotado!\nPontuação: ${score}\nPatente: ${rank}`);
}