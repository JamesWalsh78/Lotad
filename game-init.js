import { highlightTowers } from "./visual-updates.js";
import { updateDeckDisplay, updateDiscardDisplay } from "./visual-updates.js";
import { appendToLog } from "./log.js";

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

function setupClickHandlers(highlightTowers, updateDeckDisplay, updateDiscardDisplay, appendToLog) {
    const drawButtonP1 = document.getElementById("draw-button-p1");
    const drawButtonP2 = document.getElementById("draw-button-p2");
    const shuffleButton = document.getElementById("shuffle");
    const resetButton = document.getElementById("reset");

    if (drawButtonP1) drawButtonP1.addEventListener("click", () => highlightTowers(1));
    if (drawButtonP2) drawButtonP2.addEventListener("click", () => highlightTowers(2));
    if (shuffleButton) shuffleButton.addEventListener("click", shuffleDeck);
    if (resetButton) resetButton.addEventListener("click", () => resetGame(updateDeckDisplay, updateDiscardDisplay, appendToLog));
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed.");
    
    setupClickHandlers(highlightTowers, updateDeckDisplay, updateDiscardDisplay, appendToLog);
    console.log("Click handlers set up.");

    resetGame(updateDeckDisplay, updateDiscardDisplay, appendToLog);
    console.log("Game state reset.");
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
