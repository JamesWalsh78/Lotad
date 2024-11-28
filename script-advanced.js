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
}

function updateDiscardDisplay() {
    document.querySelector("#discard-count").innerHTML = `Total: ${discard.length}`;
}

function showDrawInstruction(player) {
    isDrawActive = true;
    console.log(`Player ${player} is drawing...`);
}

function handleDraw(playerId) {
    if (deck.length === 0) return;
    const card = deck.shift();
    discard.push(card);

    const hand = document.querySelector(`#player-${playerId}-hand`);
    const cardImg = document.createElement("img");
    cardImg.src = `assets/${card.toLowerCase()}.png`;
    cardImg.classList.add("card");
    hand.appendChild(cardImg);

    updateDeckDisplay();
    updateDiscardDisplay();
}

function resetGame() {
    createDeck();
    shuffleDeck();
    discard = [];
    document.querySelectorAll(".tower").forEach(tower => (tower.innerHTML = ""));
    document.querySelectorAll(".hand").forEach(hand => (hand.innerHTML = ""));
    updateDeckDisplay();
    updateDiscardDisplay();
}

document.getElementById("draw-button-p1").addEventListener("click", () => handleDraw(1));
document.getElementById("draw-button-p2").addEventListener("click", () => handleDraw(2));
document.getElementById("shuffle-button").addEventListener("click", shuffleDeck);
document.getElementById("reset-button").addEventListener("click", resetGame);

// Initial Setup
resetGame();
