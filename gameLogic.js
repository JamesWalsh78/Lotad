import { drawCard, discardPile, deck } from "./deck.js";
import { Player } from "./player.js";
import { logEvent } from "./logger.js";
import { promptPlacement, updateTowerTally, updateHandUI } from "./uiController.js";

export let players = [];
export let currentPlayerIndex = 0;

export function setupGame() {
  players = [new Player("1"), new Player("2")]; // "1" and "2" correspond to player numbers for easy UI mapping
  players.forEach((player) => updateHandUI(player)); // Ensure hands are cleared
  updateDeckTally();
  takeTurn();
}

export function takeTurn() {
  const player = players[currentPlayerIndex];
  logEvent(`${player.name}'s turn.`);
  
  // Step 1: Draw a card
  const card = drawCard();
  logEvent(`${player.name} drew a ${card.type}.`);

  // Step 2: Prompt placement
  promptPlacement(player, card);
}

export function checkWin(player) {
  const towers = Object.values(player.towers);

  for (const tower of towers) {
    let blackCount = 0, brownCount = 0, whiteCount = 0;

    for (const card of tower) {
      if (card.colour === "Black") blackCount += card.value;
      if (card.colour === "Brown") brownCount += card.value;
      if (card.colour === "White") whiteCount += card.value;
      if (card.colour === "Blue") continue;

      if (blackCount >= 4 || brownCount >= 4 || whiteCount >= 7) {
        logEvent(`${player.name} wins with ${card.type}!`);
        return true;
      }
    }
  }
  return false;
}

export function endTurn() {
  const player = players[currentPlayerIndex];
  if (checkWin(player)) {
    logEvent("Game over.");
    return;
  }

  // Alternate players
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  updateDeckTally();
  takeTurn(); // Start the next player's turn
}


// Update deck and discard tally
function updateDeckTally() {
  const tally = document.getElementById("deck-tally");
  tally.textContent = `Deck: ${deck.length} | Discard: ${discardPile.length}`;
}
