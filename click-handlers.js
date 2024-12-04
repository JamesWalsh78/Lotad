import { deck, discard, isDrawActive, resetGame } from "./game-init.js";
import { updateDeckDisplay, updateDiscardDisplay } from "./visual-updates.js";
import { checkForConflict, discardCards } from "./discard-logic.js";
import { updateTowerTally, checkWinCondition } from "./tally-win.js";
import { appendToLog } from "./log.js";

function handleTowerClick(event, playerId) {
    if (!isDrawActive || deck.length === 0) return;

    const tower = event.target.closest(".tower");
    if (!tower) {
        console.error("Tower not found.");
        return;
    }

    const towerId = tower.id.includes("left") ? "left" : "right";
    const card = deck.shift();

    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card-container");
    cardDiv.dataset.colour = card.colour; 
    cardDiv.style.setProperty("--card-index", tower.childElementCount);

    const cardImage = document.createElement("img");
    cardImage.src = `assets/${card.name.toLowerCase()}.png`;
    cardDiv.appendChild(cardImage);

    tower.appendChild(cardDiv);

    // Initialize the cards in the tower
    let cardsInTower = Array.from(tower.children).map(child => ({
        element: child,
        colour: child.dataset.colour
    }));

    // Check and resolve conflicts recursively
    let conflictIndex = checkForConflict(cardsInTower.map(c => c.colour), card.colour);
    while (conflictIndex !== -1) {
        const discardedCards = cardsInTower.slice(conflictIndex);
        discard.push(...discardedCards.map(c => c.colour));
        appendToLog(`Player ${playerId} discarded ${discardedCards.length} cards due to conflict.`);

        // Remove the discarded cards from the DOM
        discardedCards.forEach(card => card.element.remove());

        // Update cardsInTower after removing discarded cards
        cardsInTower = Array.from(tower.children).map(child => ({
            element: child,
            colour: child.dataset.colour
        }));

        // Check for new conflicts in the updated tower
        conflictIndex = checkForConflict(cardsInTower.map(c => c.colour), card.colour);
    }

    const remainingCards = Array.from(tower.children).map(child => child.dataset.colour);
    updateTowerTally(playerId, towerId, remainingCards);

    appendToLog(`Player ${playerId} placed ${card.name} (${card.colour}) in ${towerId} tower.`);

    if (towerTotals[`player${playerId}`][towerId].black >= 4) {
        appendToLog(`Player ${playerId} has collected 4 Black cards in the ${towerId} tower and has won the game!`);
    } else if (towerTotals[`player${playerId}`][towerId].brown >= 4) {
        appendToLog(`Player ${playerId} has collected 4 Brown cards in the ${towerId} tower and has won the game!`);
    }

    updateDeckDisplay();
    updateDiscardDisplay();
    isDrawActive = false;

    document.querySelectorAll(".tower").forEach((t) => t.classList.remove("highlight"));
}

export { handleTowerClick };
