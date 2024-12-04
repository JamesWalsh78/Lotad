// click-handlers.js

function handleTowerClick(event, playerId) {
    if (!isDrawActive || deck.length === 0) return;
    const tower = event.target.closest(".tower");
    if (!tower) return;
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
        const discardedCards = cardsInTower.slice(conflictIndex);
        discard.push(...discardedCards.map(c => c.colour));
        appendToLog(`Player ${playerId} discarded ${discardedCards.length} cards due to conflict.`);
        discardedCards.forEach(card => card.element.remove());
        cardsInTower = Array.from(tower.children).map(child => ({
            element: child,
            colour: child.dataset.colour
        }));
        conflictIndex = checkForConflict(cardsInTower.map(c => c.colour), card.colour);
    }
    const remainingCards = Array.from(tower.children).map(child => child.dataset.colour);
    updateTowerTally(playerId, towerId, remainingCards);
}
