import { setupDeck, drawCard, deck, discardPile } from "./deck.js";
import { setupGame, takeTurn, players, endTurn } from "./gameLogic.js";
import { logEvent } from "./logger.js";

function runTests() {
  console.log("Starting tests...");

  // Step 1: Set up the deck
  setupDeck();
  console.log("Deck after setup:", deck);

  // Step 2: Set up the game
  setupGame();
  console.log("Players after setup:", players);

  // Step 3: Simulate drawing cards
  console.log("Player 1's turn:");
  takeTurn(); // Simulate Player 1's turn
  console.log("Deck after Player 1 draws:", deck);

  // Step 4: Simulate placing cards
  const card = drawCard(); // Directly draw a card
  console.log("Card drawn for testing:", card);

  // Simulate Player 1 placing a card on their left tower
  const player1 = players[0];
  player1.placeCard(card, "left");
  console.log("Player 1's left tower after placement:", player1.towers.left);

  // Step 5: Test end turn
  endTurn();
  console.log("Current player index after endTurn:", currentPlayerIndex);
}

runTests();
