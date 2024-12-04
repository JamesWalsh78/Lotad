// visual-updates.js
import { deck, discard } from './game-init.js';

export function updateDeckDisplay() {
    const nextCard = deck.length > 0 ? deck[0] : { name: "back" };
    const deckImage = document.querySelector("#next-card img");
    if (deckImage) {
        deckImage.src = nextCard.name ? `assets/${nextCard.name.toLowerCase()}.png` : "assets/back.png";
        deckImage.onerror = () => {
            deckImage.src = "assets/placeholder.png";
        };
    }

    const deckCountElement = document.querySelector("#deck-count");
    if (deckCountElement) {
        deckCountElement.innerHTML = `
        Total: ${deck.length}<br>
        Poocheyena: ${deck.filter(c => c.name === "Poocheyena").length}<br>
        Larvitar: ${deck.filter(c => c.name === "Larvitar").length}<br>
        Lotad: ${deck.filter(c => c.name === "Lotad").length}`;
    }
}

export function updateDiscardDisplay() {
    const discardCountElement = document.querySelector("#discard-count");
    if (discardCountElement) discardCountElement.innerHTML = `Total: ${discard.length}`;
}

export function highlightTowers(playerId, handleTowerClick) {
    const towers = document.querySelectorAll(`#player-${playerId}-left-tower, #player-${playerId}-right-tower`);
    towers.forEach((tower) => {
        const newTower = tower.cloneNode(true);
        tower.parentNode.replaceChild(newTower, tower);
        newTower.classList.add("highlight");
        newTower.addEventListener("click", (event) => handleTowerClick(event, playerId), { once: true });
    });
}
