// Initialize the deck
let deck = [];
let isDrawActive = false;

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

// Show the draw instruction
function showDrawInstruction() {
    const drawInstruction = document.getElementById("draw-instruction");
    drawInstruction.textContent = "Select a tower to place the next card.";
    drawInstruction.style.display = "block";

    // Enable tower clicks
    isDrawActive = true;
    document.querySelectorAll('.tower').forEach(tower => {
        tower.classList.add("highlight");
        tower.addEventListener('click', handleTowerClick, { once: true });
    });
}

// Hide the draw instruction
function hideDrawInstruction() {
    const drawInstruction = document.getElementById("draw-instruction");
    drawInstruction.textContent = "";
    drawInstruction.style.display = "none";

    // Disable tower highlights
    isDrawActive = false;
    document.querySelectorAll('.tower').forEach(tower => {
        tower.classList.remove("highlight");
    });
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

// Handle tower click
function handleTowerClick(event) {
    if (!isDrawActive) return;

    if (deck.length === 0) {
        alert("The deck is empty!");
        hideDrawInstruction();
        return;
    }

    const towerId = event.currentTarget.id;
    const card = deck.shift();
    updateTower(towerId, card);
    updateDeckDisplay();

    // Provide feedback
    alert(`${card} added to ${towerId.replace("-", " ")}`);

    // Hide the instruction after placing a card
    hideDrawInstruction();
}

// Reset the towers
function resetTowers() {
    document.querySelectorAll('.tower').forEach(tower => (tower.innerHTML = ''));
}

// Reset the game
function resetGame() {
    createDeck();
    shuffleDeck(deck);
    resetTowers();
    updateDeckDisplay();
    hideDrawInstruction();
}

// Initialize the game
createDeck();
shuffleDeck(deck);
updateDeckDisplay();
resetTowers();

// Button event listeners
document.getElementById('draw-button').addEventListener('click', showDrawInstruction);
document.getElementById('shuffle-button').addEventListener('click', () => shuffleDeck(deck));
document.getElementById('reset-button').addEventListener('click', resetGame);
