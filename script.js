// Step 1: Create the deck
let deck = [];

// Add cards to the deck
for (let i = 0; i < 8; i++) {
    deck.push("Poocheyena");
}
for (let i = 0; i < 10; i++) {
    deck.push("Larvitar");
}
for (let i = 0; i < 3; i++) {
    deck.push("Lotad");
}

// Step 2: Display the deck order
function displayDeck(deck) {
    const outputArea = document.getElementById('game-output');
    outputArea.textContent = `Deck: ${deck.join(', ')}`;
}

// Initial display
displayDeck(deck);

// Shuffle function using Fisher-Yates algorithm
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    displayDeck(deck);
}

// Add click functionality to the game box for shuffling
const gameBox = document.getElementById('game-box');
gameBox.addEventListener('click', () => {
    shuffleDeck(deck);
});
