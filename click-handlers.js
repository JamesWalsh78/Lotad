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

    let cardsInTower = Array.from(tower.children).map(child => ({
        element: child,
        colour: child.dataset.colour,
    }));

    let conflictIndex = checkForConflict(cardsInTower.map(c => c.colour), card.colour);
    while (conflictIndex !== -1) {
        cardsInTower = discardCards(tower, cardsInTower, conflictIndex, discard);
        appendToLog(`Player ${playerId} discarded cards due to conflict.`);
        conflictIndex = checkForConflict(cardsInTower.map(c => c.colour), card.colour);
    }

    const remainingCards = Array.from(tower.children).map(child => child.dataset.colour);
    updateTowerTally(playerId, towerId, remainingCards);

    appendToLog(`Player ${playerId} placed ${card.name} (${card.colour}) in ${towerId} tower.`);

    if (checkWinCondition(playerId, towerId, appendToLog)) {
        appendToLog("Game Over. Resetting game...");
        setTimeout(() => resetGame(updateDeckDisplay, updateDiscardDisplay, appendToLog), 2000);
    }

    updateDeckDisplay();
    updateDiscardDisplay();
    isDrawActive = false;

    document.querySelectorAll(".tower").forEach(t => t.classList.remove("highlight"));
}

export { handleTowerClick };
