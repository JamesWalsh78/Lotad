let deck = [];
let discard = [];
let isDrawActive = false;

const towerTotals = {
    player1: {
        left: { black: 0, brown: 0 },
        right: { black: 0, brown: 0 },
    },
    player2: {
        left: { black: 0, brown: 0 },
        right: { black: 0, brown: 0 },
    },
};

function createDeck() {
    deck = [];
    for (let i = 0; i < 11; i++) deck.push({ name: "Poocheyena", colour: "Black", value: 1 });
    for (let i = 0; i < 11; i++) deck.push({ name: "Larvitar", colour: "Brown", value: 1 });
    for (let i = 0; i < 2; i++) deck.push({ name: "Lotad", colour: "Blue", value: 0 });
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function resetGame(updateDeckDisplay, updateDiscardDisplay, appendToLog) {
    createDeck();
    shuffleDeck();
    discard = [];
    isDrawActive = false;

    Object.keys(towerTotals).forEach(player => {
        Object.keys(towerTotals[player]).forEach(tower => {
            towerTotals[player][tower].black = 0;
            towerTotals[player][tower].brown = 0;
        });
    });

    document.querySelectorAll(".tower").forEach(tower => {
        tower.innerHTML = "";
        tower.classList.remove("highlight");
    });

    const logText = document.querySelector("#log-text");
    if (logText) logText.innerHTML = "";

    updateDeckDisplay();
    updateDiscardDisplay();
    appendToLog("Game has been reset!");
}

// Add game initialization logic when the DOM is ready
import { setupClickHandlers } from "./click-handlers.js";
import { updateDeckDisplay, updateDiscardDisplay } from "./visual-updates.js";
import { appendToLog } from "./log.js";

document.addEventListener("DOMContentLoaded", () => {
    const towers = document.querySelectorAll(".tower");
    if (towers.length === 0) {
        console.error("No towers found on the page.");
    }

    setupClickHandlers();
    resetGame(updateDeckDisplay, updateDiscardDisplay, appendToLog);
});

export {
    deck,
    discard,
    isDrawActive,
    createDeck,
    shuffleDeck,
    resetGame,
    towerTotals,
};
