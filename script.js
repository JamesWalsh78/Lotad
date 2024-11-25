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
    displayDeck();
}

// Display the current deck state
function displayDeck() {
    const outputArea = document.getElementById('game-output');
    outputArea.textContent = `Deck: ${deck.join(', ')}`;
}

// Update a tower visually
function updateTower(towerId, card) {
    const tower = document.getElementById(towerId);
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card-container'); // Add a container class for styling

    // Add the card image
    const cardImage = document.createElement('img');
    cardImage.classList.add('card');
    cardImage.alt = card;
    cardImage.src = `assets/${card.toLowerCase()}.png`; // Match image file name
    cardDiv.appendChild(cardImage);

    // Append the card container to the tower
    tower.appendChild(cardDiv);
}

// Reset the towers
function resetTowers() {
    document.querySelectorAll('.tower').forEach(tower => (tower.innerHTML = ''));
}

// Handle drawing a card
function drawCard() {
    if (deck.length === 0) {
        alert("The deck is empty!");
        return;
    }

    const towerChoice = prompt(
        "Choose a tower: 'player-1-left', 'player-1-right', 'player-2-left', or 'player-2-right'"
    );
    if (!['player-1-left', 'player-1-right', 'player-2-left', 'player-2-right'].includes(towerChoice)) {
        alert("Invalid choice! Please enter a valid tower ID.");
        return;
    }

    const card = deck.shift(); // Remove the top card from the deck
    updateTower(towerChoice, card); // Add it to the selected tower
    displayDeck(); // Update the deck display
	updateDeckDisplay();
}

// Reset the game
function resetGame() {
    createDeck();
    shuffleDeck(deck);
    displayDeck();
    resetTowers();
	updateDeckDisplay();
}

// Initialize the game
createDeck();
shuffleDeck(deck);
displayDeck();

// Button event listeners
document.getElementById('draw-button').addEventListener('click', drawCard);
document.getElementById('shuffle-button').addEventListener('click', () => shuffleDeck(deck));
document.getElementById('reset-button').addEventListener('click', resetGame);

function updateDeckDisplay() {
    const nextCard = deck.length > 0 ? deck[0] : "back";
    document.getElementById("next-card").querySelector("img").src = `assets/${nextCard.toLowerCase()}.png`;

    document.getElementById("poocheyena-count").textContent = deck.filter(card => card === "Poocheyena").length;
    document.getElementById("larvitar-count").textContent = deck.filter(card => card === "Larvitar").length;
    document.getElementById("lotad-count").textContent = deck.filter(card => card === "Lotad").length;
}