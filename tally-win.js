// tally-win.js

function updateTowerTally(playerId, towerId, remainingCards) {
    towerTotals[`player${playerId}`][towerId].black = remainingCards.filter(c => c === "Black").length;
    towerTotals[`player${playerId}`][towerId].brown = remainingCards.filter(c => c === "Brown").length;
}
