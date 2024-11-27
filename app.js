import { setupDeck } from "./deck.js";
import { setupGame, takeTurn } from "./gameLogic.js";

document.addEventListener("DOMContentLoaded", () => {
  setupDeck();
  console.log("Deck initialized:", deck); // Debug: Check deck population

  setupGame();
  console.log("Game setup complete");

  // Handle the "Draw Card" button
  document.getElementById("draw-button").addEventListener("click", () => {
    console.log("Draw button clicked");
    takeTurn();
  });
});
