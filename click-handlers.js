// click-handlers.js
import { deck, discard } from './game-init.js';
import { updateTowerTally, checkWinCondition } from './tally-win.js';
import { checkForConflict } from './discard-logic.js';
import { appendToLog } from './log.js';
import { updateDeckDisplay, updateDiscardDisplay } from './visual-updates.js';

export function handleTowerClick(event, playerId) {
    const tower = event.target.closest(".tower");
    if (!tower || deck.length === 0) return;

    const towerId = tower.id.includes("left") ? "left" : "right";
    const card = deck.shift();

    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card-container");
    cardDiv.dataset.colour = card.colour;

    const cardImage = document.createElement("img");
    cardImage.src = `assets/${card.name.toLowerCase()}.png`;
    cardDiv.appendChild(cardImage);
    tower.appendChild(cardDiv);

    let cardsInTower = Array.from(tower.children).map(child => child.dataset.colour);
    let conflictIndex = checkForConflict(cardsInTower, card.colour);

    while (conflictIndex !== -1) {
        discard.push(...cardsInTower.slice(conflictIndex));
        cardsInTower = cardsInTower.slice(0, conflictIndex);
        tower.innerHTML = "";
        cardsInTower.forEach(colour => {
            const child = document.createElement("div");
            child.classList.add("card-container");
            child.dataset.colour = colour;
            tower.appendChild(child);
        });
        conflictIndex = checkForConflict(cardsInTower, card.colour);
    }

    updateTowerTally(playerId, towerId, cardsInTower);
    appendToLog(`Player ${playerId} placed ${card.name} (${card.colour}) in ${towerId} tower.`);
    if (checkWinCondition(playerId, towerId, appendToLog)) {
        discard = []; // Reset discard if win
    }
    updateDeckDisplay();
    updateDiscardDisplay();
}
