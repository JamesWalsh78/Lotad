import { setupDeck } from "./deck.js";
import { setupGame, takeTurn } from "./gameLogic.js";

document.addEventListener("DOMContentLoaded", () => {
  setupDeck();
  setupGame();

  // Handle the "Draw Card" button
  document.getElementById("draw-button").addEventListener("click", () => {
    takeTurn();
  });
});
