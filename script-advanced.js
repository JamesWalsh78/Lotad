let deck = [];
let discard = [];
let isDrawActive = false;

function createDeck() {
    deck = [];
    for (let i = 0; i < 8; i++) deck.push("Poocheyena");
    for (let i = 0; i < 10; i++) deck.push("Larvitar");
    for (let i = 0; i < 3; i++) deck.push("Lotad");
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    updateDeckDisplay();
}

function updateDeckDisplay() {
    const nextCard = deck.length > 0 ? deck[0] : "back";
    document.querySelector("#deck-count").innerHTML = `Total: ${deck.length}<br>Poocheyena: ${deck.filter(c => c === "Poocheyena").length}<br>Larvitar: ${deck.filter(c => c === "Larvitar").length}<br>Lotad: ${deck.filter(c => c === "Lotad").length}`;
    document.querySelector("#next-card img").src = `assets/${nextCard.toLowerCase()}.png`;
}

function updateDiscardDisplay() {
    document.querySelector("#discard-count").innerHTML = `Total: ${discard.length}`;
}

function appendToLog(message) {
    const logBox = document.querySelector("#log-box");
    const logEntry = document.createElement("p");
    logEntry.textContent = message;
    logBox.appendChild(logEntry);
    logBox.scrollTop = logBox.scrollHeight;
}

function highlightTowers(playerId) {
    isDrawActive = true;
    const towers = document.querySelectorAll(`#player-${playerId}-left, #player-${playerId}-right`);
    towers.forEach(tower => {
        tower.classList.add("highlight");
        tower.addEventListener("click", event => handleTowerClick(event, playerId), { once: true });
    });
}

function handleTowerClick(event, playerId) {
    if (!isDrawActive || deck.length === 0) return;

    const tower = event.target;
    const card = deck.shift();

    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card-container");
    cardDiv.style.setProperty("--card-index", tower.childElementCount);

    const cardImage = document.createElement("img");
    cardImage.src = `assets/${card.toLowerCase()}.png`;
    cardDiv.appendChild(cardImage);

    tower.appendChild(cardDiv);
    appendToLog(`${card} was placed in ${tower.id}.`);

    updateDeckDisplay();
    isDrawActive = false;

    document.querySelectorAll(".tower").forEach(t => t.classList.remove("highlight"));
}

function resetGame() {
    createDeck();
    shuffleDeck();
    discard = [];
    document.querySelectorAll(".tower").forEach(tower => (tower.innerHTML = ""));
    document.querySelector("#log-box").innerHTML = ""; // Clear log
    updateDeckDisplay();
    updateDiscardDisplay();
}

document.getElementById("draw-button-p1").addEventListener("click", () => highlightTowers(1));
document.getElementById("draw-button-p2").addEventListener("click", () => highlightTowers(2));
document.getElementById("shuffle-button").addEventListener("click", shuffleDeck);
document.getElementById("reset-button").addEventListener("click", resetGame);

// Initial Setup
resetGame();
