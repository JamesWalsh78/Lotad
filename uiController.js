import { logEvent } from "./logger.js";
import { endTurn } from "./gameLogic.js";

// Highlight towers and allow the player to place the card
export function promptPlacement(player, card) {
  const towers = document.querySelectorAll(`#player-${player.name.split(" ")[1]}-zone .tower`);
  towers.forEach((tower) => {
    tower.classList.add("highlight");

    // Add click event to place the card
    const handleClick = () => {
      const towerSide = tower.dataset.side; // Get "left" or "right"

      if (card.colour === "Item") {
        // Add to player's hand if it's an item card
        player.hand.push(card);
        updateHandUI(player);
        logEvent(`${player.name} added an item card to their hand: ${card.type}.`);
      } else {
        // Place character card on the tower
        player.placeCard(card, towerSide);
        logEvent(`${player.name} placed ${card.type} on ${towerSide} tower.`);
        updateTowerUI(player, towerSide, card); // Update the tower visually
        updateTowerTally(player, towerSide); // Update the tower tally
      }

      // Clean up
      clearHighlights();
      towers.forEach((t) => t.removeEventListener("click", handleClick)); // Remove listeners
      endTurn(); // Proceed to the next player's turn
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
