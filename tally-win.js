// tally-win.js
import { towerTotals } from './game-init.js';

export function updateTowerTally(playerId, towerId, remainingCards) {
    towerTotals[`player${playerId}`][towerId].black = remainingCards.filter(c => c === "Black").length;
    towerTotals[`player${playerId}`][towerId].brown = remainingCards.filter(c => c === "Brown").length;
}

export function checkWinCondition(playerId, towerId, appendToLog) {
    if (towerTotals[`player${playerId}`][towerId].black >= 4) {
        appendToLog(`Player ${playerId} has collected 4 Black cards in the ${towerId} tower and has won the game!`);
        return true;
    }
    if (towerTotals[`player${playerId}`][towerId].brown >= 4) {
        appendToLog(`Player ${playerId} has collected 4 Brown cards in the ${towerId} tower and has won the game!`);
        return true;
    }
    return false;
}
