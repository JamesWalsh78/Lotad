import { logEvent } from "./logger.js";
import { endTurn } from "./gameLogic.js";
import { discardPile } from "./deck.js";

export function promptPlacement(player, card) {
  const towers = document.querySelectorAll(`#player-${player.name}-zone .tower`);

  // Highlight towers to prompt selection
  towers.forEach((tower) => {
    tower.classList.add("highlight");

    const handleClick = () => {
      const towerSide = tower.dataset.side;

      player.placeCard(card, towerSide);
      logEvent(`${player.name} placed ${card.type} on ${towerSide} tower.`);

      handleDiscard(player, towerSide);

      updateTowerUI(player, towerSide, card);
      updateTowerTally(player, towerSide);

      clearHighlights();
      towers.forEach((t) => t.removeEventListener("click", handleClick));

      promptItemOrEndTurn(player);
    };

    tower.addEventListener("click", handleClick);
  });
}

function handleDiscard(player, towerSide) {
  const tower = player.towers[towerSide];
  let discardIndex = -1;

  if (tower.length >= 2) {
    const topCard = tower[tower.length - 1];
    const secondCard = tower[tower.length - 2];

    if (
      (topCard.colour === "Brown" && secondCard.colour === "Black") ||
      (topCard.colour === "Black" && secondCard.colour === "Brown")
    ) {
      discardIndex = tower.length - 2;
    }
  }

  for (let i = discardIndex; i >= 0; i--) {
    const card = tower[i];
    if (card.colour === "Blue") {
      discardIndex = i;
      break;
    }
  }

  if (discardIndex !== -1) {
    const discardedCards = tower.splice(discardIndex);
    discardPile.push(...discardedCards);
    logEvent(
      `Discarded cards from ${player.name}'s ${towerSide} tower: ${discardedCards
        .map((c) => c.type)
        .join(", ")}`
    );
  }
}

export function updateHandUI(player) {
  const handElement = document.querySelector(`#player-${player.name}-zone .hand`);
  if (!handElement) {
    console.error(`Hand element for ${player.name} not found`);
    return;
  }

  handElement.innerHTML = "";

  player.hand.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.textContent = card.type;
    cardElement.style.backgroundColor = getCardColor(card.colour);
    cardElement.style.color = "#000";
    cardElement.style.padding = "5px";
    cardElement.style.margin = "2px";
    handElement.appendChild(cardElement);
  });
}

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
