import { logEvent } from "./logger.js";
import { endTurn } from "./gameLogic.js";

// Highlight towers and allow the player to place the card
export function promptPlacement(player, card) {
  const towers = document.querySelectorAll(`#player-${player.name.split(" ")[1]}-zone .tower`);

  // Highlight towers to prompt selection
  towers.forEach((tower) => {
    tower.classList.add("highlight");

    // Add click event to place the card
    const handleClick = () => {
      const towerSide = tower.dataset.side; // "left" or "right"

      // Place the card on the selected tower
      player.placeCard(card, towerSide);
      logEvent(`${player.name} placed ${card.type} on ${towerSide} tower.`);
      
      // Update the tower visually
      updateTowerUI(player, towerSide, card);
      // Update the tower tally
      updateTowerTally(player, towerSide);

      // Clean up: Remove highlights and listeners
      clearHighlights();
      towers.forEach((t) => t.removeEventListener("click", handleClick));

      // Prompt the player to play an item card or end their turn
      promptItemOrEndTurn(player);
    };

    tower.addEventListener("click", handleClick);
  });
}

// Clear highlighting from all towers
function clearHighlights() {
  const towers = document.querySelectorAll(".tower");
  towers.forEach((tower) => tower.classList.remove("highlight"));
}

// Update the tower UI visually
export function updateTowerUI(player, towerSide, card) {
  const towerElement = document.querySelector(`#player-${player.name.split(" ")[1]}-zone .tower[data-side="${towerSide}"]`);
  const cardElement = document.createElement("div");
  cardElement.textContent = card.type;
  cardElement.style.backgroundColor = getCardColor(card.colour); // Helper function for colours
  cardElement.style.color = card.colour === "White" ? "#000" : "#fff"; // High contrast for white cards
  cardElement.style.padding = "5px";
  cardElement.style.margin = "2px";
  cardElement.style.textAlign = "center";
  cardElement.style.border = "1px solid #333";
  cardElement.style.borderRadius = "5px";
  towerElement.appendChild(cardElement);
}

// Update tower tally UI
export function updateTowerTally(player, towerSide) {
  const tower = player.towers[towerSide];
  const tally = { Black: 0, Brown: 0, White: 0 };

  for (const card of tower) {
    if (card.colour in tally) {
      tally[card.colour] += card.value === "special" ? 0 : card.value; // Mantine adds no value directly
    }
  }

  const tallyElement = document.querySelector(`#player-${player.name.split(" ")[1]}-zone .${towerSide}-tally`);
  tallyElement.textContent = `Black: ${tally.Black}, Brown: ${tally.Brown}, White: ${tally.White}`;
}

// Update the hand UI
export function updateHandUI(player) {
  const handElement = document.querySelector(`#player-${player.name.split(" ")[1]}-zone .hand`);
  handElement.innerHTML = ""; // Clear existing cards

  for (const card of player.hand) {
    const cardElement = document.createElement("div");
    cardElement.textContent = card.type;
    cardElement.style.backgroundColor = getCardColor(card.colour);
    cardElement.style.color = "#000";
    cardElement.style.padding = "5px";
    cardElement.style.margin = "2px";
    cardElement.style.textAlign = "center";
    cardElement.style.border = "1px solid #333";
    cardElement.style.borderRadius = "5px";
    handElement.appendChild(cardElement);
  }
}

// Prompt the player to play an item card or end their turn
function promptItemOrEndTurn(player) {
  const logDiv = document.getElementById("log");

  // Add a message to prompt the player
  const endTurnMessage = document.createElement("div");
  endTurnMessage.innerHTML = `
    <p>${player.name}, choose an action:</p>
    <button id="play-item">Play an Item Card</button>
    <button id="end-turn">End Turn</button>
  `;
  logDiv.appendChild(endTurnMessage);

  // Add event listeners for the buttons
  document.getElementById("play-item").addEventListener("click", () => {
    logEvent(`${player.name} chose to play an item card.`);
    // Logic for item card usage (future implementation)
    endTurnMessage.remove(); // Remove prompt
  });

  document.getElementById("end-turn").addEventListener("click", () => {
    logEvent(`${player.name} ended their turn.`);
    endTurnMessage.remove(); // Remove prompt
    endTurn(); // Proceed to the next player's turn
  });
}

// Helper function to get colours for card types
function getCardColor(colour) {
  const colours = {
    Black: "#000",
    Brown: "#964B00",
    White: "#fff",
    Blue: "#007bff",
    Item: "#ffc107",
  };
  return colours[colour] || "#ccc";
}
