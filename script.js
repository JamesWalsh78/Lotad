// Initialize the deck
let deck = [];
function createDeck() {
    deck = [];
    for (let i = 0; i < 8; i++) deck.push("Poocheyena");
    for (let i = 0; i < 10; i++) deck.push("Larvitar");
    for (let i = 0; i < 3; i++) deck.push("Lotad");
}

// Shuffle the deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    updateDeckDisplay();
}

// Display the deck state in the UI
function updateDeckDisplay() {
    const nextCard = deck.length > 0 ? deck[0] : "back";
    document.getElementById("next-card").querySelector("img").src = `assets/${nextCard.toLowerCase()}.png`;

    document.getElementById("poocheyena-count").textContent = deck.filter(card => card === "Poocheyena").length;
    document.getElementById("larvitar-count").textContent = deck.filter(card => card === "Larvitar").length;
    document.getElementById("lotad-count").textContent = deck.filter(card => card === "Lotad").length;
}

// Update a tower visually
function updateTower(towerId, card) {
    const tower = document.getElementById(towerId);
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card-container');

    const cardImage = document.createElement('img');
    cardImage.classList.add('card');
    cardImage.alt = card;
    cardImage.src = `assets/${card.toLowerCase()}.png`;
    cardDiv.appendChild(cardImage);

    tower.appendChild(cardDiv);
}

// Reset towers
function resetTowers() {
    document.querySelectorAll('.tower').forEach(tower => (tower.innerHTML = ''));
}

// Handle card placement on tower click
function handleTowerClick(event) {
    if (deck.length === 0) {
        alert("The deck is empty!");
        return;
    }
    const towerId = event.currentTarget.id;
    const card = deck.shift();
    updateTower(towerId, card);
    updateDeckDisplay();
}

// Reset the game
function resetGame() {
    createDeck();
    shuffleDeck(deck);
    resetTowers();
    updateDeckDisplay();
}

// Initialize the game
createDeck();
shuffleDeck(deck);
updateDeckDisplay();
resetTowers();

// Add click listeners to towers
document.querySelectorAll('.tower').forEach(tower => {
    tower.addEventListener('click', handleTowerClick);
});

// Button event listeners
document.getElementById('shuffle-button').addEventListener('click', () => shuffleDeck(deck));
document.getElementById('reset-button').addEventListener('click', resetGame);
