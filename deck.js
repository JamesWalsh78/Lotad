export const deck = [];
export const discardPile = [];

// Create initial deck
export function setupDeck() {
  const cards = [
    { type: "Poocheyena", value: 1, colour: "Black" },
    { type: "Larvitar", value: 1, colour: "Brown" },
    { type: "Mighteyena", value: 2, colour: "Black" },
    { type: "Pupitar", value: 2, colour: "Brown" },
    { type: "Normal Magikarp", value: 1, colour: "White" },
    { type: "Shiny Magikarp", value: 2, colour: "White" },
    { type: "Mantine", value: "special", colour: "Blue" },
    { type: "Switch", value: "item", colour: "Item" },
    { type: "Return", value: "item", colour: "Item" },
  ];

  const counts = {
    Poocheyena: 11,
    Larvitar: 11,
    Mighteyena: 1,
    Pupitar: 1,
    "Normal Magikarp": 3,
    "Shiny Magikarp": 1,
    Mantine: 1,
    Switch: 4,
    Return: 5,
  };

  // Populate deck
  for (const card of cards) {
    for (let i = 0; i < counts[card.type]; i++) {
      deck.push({ ...card });
    }
  }

  shuffle(deck);
}

// Shuffle deck
export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Draw card
export function drawCard() {
  if (deck.length === 0) {
    deck.push(...discardPile);
    discardPile.length = 0;
    shuffle(deck);
  }
  return deck.pop();
}
