// Updated "discard-logic.js"

function checkForConflict(cards, newCardColour) {
    let discardStartIndex = -1; // Default: no discard needed

    // Traverse from top of the pile to bottom
    for (let i = cards.length - 1; i >= 0; i--) {
        const topCardColour = cards[i];

        // Allow placement if the current card is not Black or Brown
        if (topCardColour !== "Black" && topCardColour !== "Brown") {
            return discardStartIndex; // No conflict for non-conflicting colours
        }

        // Check for a conflict (Black vs Brown or Brown vs Black)
        if (
            (newCardColour === "Black" && topCardColour === "Brown") ||
            (newCardColour === "Brown" && topCardColour === "Black")
        ) {
            discardStartIndex = i; // Conflict detected
        }
    }

    // Include all cards down to the last Blue (if present) in the discard
    if (discardStartIndex !== -1) {
        for (let j = discardStartIndex; j >= 0; j--) {
            if (cards[j] === "Blue") {
                return j; // Include the Blue card in the discard sequence
            }
        }
        return 0; // No Blue found, discard everything
    }

    return -1; // No conflict
}

function discardCards(tower, cards, startIndex, discardPile) {
    const discardedCards = cards.slice(startIndex);
    discardPile.push(...discardedCards);

    // Remove the discarded cards from the DOM
    discardedCards.forEach(card => card.element.remove());

    return cards.slice(0, startIndex); // Return the remaining cards in the tower
}

export {
    checkForConflict,
    discardCards
};
