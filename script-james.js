// VARIABLES
let deck = []
let discard = []
let isDrawActive = false;



//TALLY LOGIC
const towerTotals = {
    player1: {
        left: { black: 0, brown: 0 },
        right: { black: 0, brown: 0 }
    },
    player2: {
        left: { black: 0, brown: 0 },
        right: { black: 0, brown: 0 }
    }
};

function updateTowerTally(playerId, towerId, remainingCards) {
    towerTotals[`player${playerId}`][towerId].black = remainingCards.filter(c => c === "Black").length;
    towerTotals[`player${playerId}`][towerId].brown = remainingCards.filter(c => c === "Brown").length;
}

//INITIAL SETUP
function createDeck() {
    deck = [];
    for (let i = 0; i < 11; i++) deck.push({ name: "Poocheyena", colour: "Black", value: 1 });
    for (let i = 0; i < 11; i++) deck.push({ name: "Larvitar", colour: "Brown", value: 1 });
    for (let i = 0; i < 2; i++) deck.push({ name: "Lotad", colour: "Blue", value: 0 });
}

function shuffleDeck() {
	for (let i =deck.length -1; i>0; i--) {
		const j = Math.floor(Math.random() * (i+1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}
	updateDeckDisplay();
}

//LOG
function appendToLog(message) {
	const logText = document.querySelector("#log-text");
	if (logText) {
		const logEntry = document.createElement("p");
		logEntry.textContent = message;
		logText.appendChild(logEntry);
		logText.scrollTop = logText.scrollHeight;
	} else {
		console.error("Log text element not found.");
	}
}

//GAME STATE DISPLAY
function updateDeckDisplay() {
	const nextCard = deck.length > 0 ? deck[0] : { name: "back" };
	const deckImage = document.querySelector("#next-card img");
	
	if (deckImage) {
		deckImage.src = nextCard.name ? `assets/${nextCard.name.toLowerCase()}.png` : "assets/back.png";
		deckImage.onerror = () => {
			deckImage.src = "assets/placeholder.png";
		};
	} else {
		console.error("Deck image element not found.")
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

//TOWER DISPLAY
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

//PLACEMENT LOGIC
function handleTowerClick(event, playerId) {
    if (!isDrawActive || deck.length === 0) return;

    const tower = event.target.closest(".tower");
    if (!tower) {
        console.error("Tower not found.");
        return;
    }

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

    // Initialize the cards in the tower
    let cardsInTower = Array.from(tower.children).map(child => ({
        element: child,
        colour: child.dataset.colour
    }));

    // Check and resolve conflicts recursively
    let conflictIndex = checkForConflict(cardsInTower.map(c => c.colour), card.colour);
    while (conflictIndex !== -1) {
        const discardedCards = cardsInTower.slice(conflictIndex);
        discard.push(...discardedCards.map(c => c.colour));
        appendToLog(`Player ${playerId} discarded ${discardedCards.length} cards due to conflict.`);

        // Remove the discarded cards from the DOM
        discardedCards.forEach(card => card.element.remove());

        // Update cardsInTower after removing discarded cards
        cardsInTower = Array.from(tower.children).map(child => ({
            element: child,
            colour: child.dataset.colour
        }));

        // Check for new conflicts in the updated tower
        conflictIndex = checkForConflict(cardsInTower.map(c => c.colour), card.colour); //different function notation => here. Can refactor later
    }

    const remainingCards = Array.from(tower.children).map(child => child.dataset.colour);
    updateTowerTally(playerId, towerId, remainingCards);

    appendToLog(`Player ${playerId} placed ${card.name} (${card.colour}) in ${towerId} tower.`);

    if (towerTotals[`player${playerId}`][towerId].black >= 4) {
        appendToLog(`Player ${playerId} has collected 4 Black cards in the ${towerId} tower and has won the game!`);
    } else if (towerTotals[`player${playerId}`][towerId].brown >= 4) {
        appendToLog(`Player ${playerId} has collected 4 Brown cards in the ${towerId} tower and has won the game!`);
    }

    updateDeckDisplay();
    updateDiscardDisplay();
    isDrawActive = false;

    document.querySelectorAll(".tower").forEach((t) => t.classList.remove("highlight"));
}

//DISCARD LOGIC
function checkForConflict(cards, newCardColour) {
    console.log("Starting conflict check...");
    console.log("Cards in tower:", cards);
    console.log("New card colour:", newCardColour);

    // Traverse from top of the pile to bottom
    for (let i = cards.length - 1; i >= 0; i--) {
        const topCardColour = cards[i];
        console.log(`Index: ${i}, Top Card Colour: ${topCardColour}`);

        // Allow placement if the current card is not Black or Brown
        if (topCardColour !== "Black" && topCardColour !== "Brown") {
            console.log("No conflict detected: Non-conflicting colour found.");
            return -1; // No conflict, placement allowed
        }

        // Check for a conflict (Black vs Brown or Brown vs Black)
        if (
            (newCardColour === "Black" && topCardColour === "Brown") ||
            (newCardColour === "Brown" && topCardColour === "Black")
        ) {
            console.log(`Conflict detected at index: ${i}`);
            return i; // Conflict detected
        }
    }

    console.log("No conflict detected: Default return.");
    return -1; // No conflict
}

//RESET GAME
function resetGame() {
	createDeck();
	shuffleDeck();
	discard = [];
	towerTotals.player1 = {
        left: { black: 0, brown: 0 },
        right: { black: 0, brown: 0 }
    };
    towerTotals.player2 = {
        left: { black: 0, brown: 0 },
        right: { black: 0, brown: 0 }
    };
	document.querySelectorAll(".tower").forEach(tower => (tower.innerHTML = ""));
	const logText = document.querySelector("#log-text");
    if (logText) {
        logText.innerHTML = "";
    } else {
        console.error("Log text element not found.");
    }
	updateDeckDisplay();
	updateDiscardDisplay();
}

//EVENT LISTENERS
document.addEventListener("DOMContentLoaded", () => {
	const towers = document.querySelectorAll(".tower");
	if (towers.length === 0) {
		console.error("No towers found on the page.")
	}
	const drawButtonP1 = document.getElementById("draw-button-p1");
	const drawButtonP2 = document.getElementById("draw-button-p2");
	const shuffleButton = document.getElementById("shuffle");
	const resetButton = document.getElementById("reset");
	
	if (drawButtonP1) drawButtonP1.addEventListener("click", () => highlightTowers(1));
	if (drawButtonP2) drawButtonP2.addEventListener("click", () => highlightTowers(2));
	if (shuffleButton) shuffleButton.addEventListener("click", shuffleDeck);
	if (resetButton) resetButton.addEventListener("click", resetGame);
	
	resetGame();
});
	