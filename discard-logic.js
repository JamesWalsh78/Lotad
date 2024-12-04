// discard-logic.js

function checkForConflict(cards, newCardColour) {
    for (let i = cards.length - 1; i >= 0; i--) {
        const topCardColour = cards[i];
        if (i === cards.length - 1 && topCardColour !== "Black" && topCardColour !== "Brown") {
            return -1; 
        }
        if ((newCardColour === "Black" && topCardColour === "Brown") ||
            (newCardColour === "Brown" && topCardColour === "Black")) {
            return i; 
        }
    }
    return -1;
}
