import { logEvent } from "./logger.js";
import { endTurn } from "./gameLogic.js";

// Highlight towers and allow the player to place the card
export function promptPlacement(player, card) {
  const towers = document.querySelectorAll(`#player-${player.name.split(" ")[1]}-zone .tower`);
  towers.forEach((tower) => {
    tower.classList.add("highlight");

    // Add click event to place the card
    tower.addEventListener("click", function handleClick() {
      const towerSide = tower.dataset.side; // Get "left" or "right"
      player.placeCard(card, towerSide);
      logEvent(`${player.name} placed ${card.type} on ${towerSide} tower.`);
      updateTowerUI(player, towerSide, card); // Update the tower visually
      clearHighlights();
      endTurn();

      // Remove event listener after placing
      tower.removeEventListener("click", handleClick);
    });
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
  cardElement.style.padding = "5px";
  cardElement.style.margin = "2px";
  cardElement.style.textAlign = "center";
  towerElement.appendChild(cardElement);
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
