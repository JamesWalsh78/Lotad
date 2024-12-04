// discard-logic.js

export function checkForConflict(cards, newCardColour) {
    for (let i = cards.length - 1; i >= 0; i--) {
        const topCardColour = cards[i];
        if (topCardColour !== "Black" && topCardColour !== "Brown") {
            return -1; // No conflict, placement allowed
        }
        if (
            (newCardColour === "Black" && topCardColour === "Brown") ||
            (newCardColour === "Brown" && topCardColour === "Black")
        ) {
            return i; // Conflict detected
        }
    }
    return -1; // No conflict
}
