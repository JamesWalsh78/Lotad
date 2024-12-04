// Updated "visual-updates.js"
import { deck, discard } from "./game-init.js";
import { handleTowerClick } from "./click-handlers.js";

function updateDeckDisplay() {
    const nextCard = deck.length > 0 ? deck[0] : { name: "back" };
    const deckImage = document.querySelector("#next-card img");

    if (deckImage) {
        deckImage.src = nextCard.name ? `assets/${nextCard.name.toLowerCase()}.png` : "assets/back.png";
        deckImage.onerror = () => {
            deckImage.src = "assets/placeholder.png";
        };
    } else {
        console.error("Deck image element not found.");
    }

    const deckCountElement = document.querySelector("#deck-count");
    if (deckCountElement) {
        deckCountElement.innerHTML = `
        Total: ${deck.length}<br>
        Poocheyena: ${deck.filter(c => c.name === "Poocheyena").length}<br>
        Larvitar: ${deck.filter(c => c.name === "Larvitar").length}<br>
        Lotad: ${deck.filter(c => c.name === "Lotad").length}`;
    } else {
        console.error("Deck count element not found.");
    }
}

function updateDiscardDisplay() {
    const discardCountElement = document.querySelector("#discard-count");

    if (discardCountElement) {
        discardCountElement.innerHTML = `Total: ${discard.length}`;
    } else {
        console.error("Discard count element not found.");
    }
}

function highlightTowers(playerId) {
    isDrawActive = true;

    const towers = document.querySelectorAll(`#player-${playerId}-left-tower, #player-${playerId}-right-tower`);
    towers.forEach((tower) => {

        const newTower = tower.cloneNode(true);
        tower.parentNode.replaceChild(newTower, tower);

        newTower.classList.add("highlight");
        newTower.addEventListener(
            "click",
            (event) => handleTowerClick(event, playerId),
            { once: true }
        );
    });
}

export {
    updateDeckDisplay,
    updateDiscardDisplay,
    highlightTowers
};
