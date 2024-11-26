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

    // Enable tower title clicks
    isDrawActive = true;
    document.querySelectorAll('.tower-title').forEach(title => {
        title.classList.add("highlight");
        title.addEventListener('click', handleTowerTitleClick, { once: true });
    });
}

// Hide the draw instruction and provide feedback
function hideDrawInstruction(feedback = "") {
    const drawInstruction = document.getElementById("draw-instruction");
    drawInstruction.textContent = feedback;
    if (!feedback) drawInstruction.style.display = "none";

    // Disable tower highlights
    isDrawActive = false;
    document.querySelectorAll('.tower-title').forEach(title => {
        title.classList.remove("highlight");
        title.replaceWith(title.cloneNode(true)); // Remove event listeners
    });
}

// Update a tower visually
function updateTower(towerId, card) {
    const tower = document.getElementById(towerId);
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card-container');
    cardDiv.style.setProperty('--card-index', tower.childElementCount); // Correct stacking

    const cardImage = document.createElement('img');
    cardImage.classList.add('card');
    cardImage.src = `assets/${card.toLowerCase()}.png`; // Correct card source
    cardDiv.appendChild(cardImage);

    tower.appendChild(cardDiv);
}
}

// Handle tower title click
function handleTowerTitleClick(event) {
    if (!isDrawActive) return;

    const titleId = event.target.id;
    const towerId = titleId.replace('-title', ''); // Derive the tower ID

    if (deck.length === 0) {
        hideDrawInstruction("The deck is empty!");
        return;
    }

    const card = deck.shift();
    updateTower(towerId, card);
    updateDeckDisplay();

    hideDrawInstruction(`${card} added to ${towerId.replace('-', ' ')}`);
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
