export class Player {
  constructor(name) {
    this.name = name;
    this.towers = { left: [], right: [] }; // Towers as arrays of cards
    this.hand = []; // For item cards
  }

  // Place a card on a tower
  placeCard(card, tower) {
    this.towers[tower].push(card);
  }
}
