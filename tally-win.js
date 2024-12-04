// Updated "tally-win.js"

import { towerTotals } from "./game-init.js";

function updateTowerTally(playerId, towerId, remainingCards) {
    towerTotals[`player${playerId}`][towerId].black = remainingCards.filter(c => c === "Black").length;
    towerTotals[`player${playerId}`][towerId].brown = remainingCards.filter(c => c === "Brown").length;
}

function checkWinCondition(playerId, towerId, appendToLog) {
    const tower = towerTotals[`player${playerId}`][towerId];

    if (tower.black >= 4) {
        appendToLog(`Player ${playerId} has collected 4 Black cards in the ${towerId} tower and has won the game!`);
        return true;
    }

    if (tower.brown >= 4) {
        appendToLog(`Player ${playerId} has collected 4 Brown cards in the ${towerId} tower and has won the game!`);
        return true;
    }

    return false;
}

export {
    updateTowerTally,
    checkWinCondition
};
