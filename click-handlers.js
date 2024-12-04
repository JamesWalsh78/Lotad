// Updated "click-handlers.js"

import { deck, discard, isDrawActive, shuffleDeck, resetGame } from "./game-init.js";
import { updateDeckDisplay, updateDiscardDisplay, highlightTowers } from "./visual-updates.js";
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
        colour: child.dataset.colour
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

    document.querySelectorAll(".tower").forEach((t) => t.classList.remove("highlight"));
}

function handleDrawClick(playerId) {
    if (!isDrawActive && deck.length > 0) {
        highlightTowers(playerId);
        isDrawActive = true;
    }
}

function setupClickHandlers() {
    const drawButtonP1 = document.getElementById("draw-button-p1");
    const drawButtonP2 = document.getElementById("draw-button-p2");
    const shuffleButton = document.getElementById("shuffle");
    const resetButton = document.getElementById("reset");

    if (drawButtonP1) drawButtonP1.addEventListener("click", () => handleDrawClick(1));
    if (drawButtonP2) drawButtonP2.addEventListener("click", () => handleDrawClick(2));
    if (shuffleButton) shuffleButton.addEventListener("click", shuffleDeck);
    if (resetButton) resetButton.addEventListener("click", () => resetGame(updateDeckDisplay, updateDiscardDisplay, appendToLog));
}

export {
    handleTowerClick,
    handleDrawClick,
    setupClickHandlers
};
