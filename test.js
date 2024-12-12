// VARIABLES
let deck = []
let discard = []
let isDrawActive = false;

// CARD DATA
const cards = [
	{ name: "Poocheyena", 	colour: "Black", 	value: 1,	dfcount: 11},
	{ name: "Larvitar", 	colour: "Brown", 	value: 1,	dfcount: 11},
	{ name: "Lotad", 		colour: "Blue", 	value: 0,	dfcount: 2},
];

//SET UP DECK
function createDeck(cardsInput) {
    deck = []; // Clear the existing deck

    // Iterate over the user-provided cardsInput
    cardsInput.forEach(({ name, count }) => {
        // Find the template for the given card name
        const cardTemplate = cards.find(card => card.name === name);
        if (cardTemplate) {
            // Add the correct number of copies of this card to the deck
            for (let i = 0; i < count; i++) {
                deck.push({ ...cardTemplate }); // Clone the cardTemplate to avoid reference issues
            }
        } else {
            console.error(`Card template not found for: ${name}`);
        }
    });

    console.log("Deck created:", deck);
    return deck;
}

function shuffleDeck() {
	for (let i =deck.length -1; i>0; i--) {
		const j = Math.floor(Math.random() * (i+1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}
	updateDeckDisplay();
}

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

//GAME STATE DISPLAY 
function updateDeckDisplay() {
    const deckImage = document.querySelector("#next-card img");
    const deckCountElement = document.querySelector("#deck-count");

    if (deckImage) {
        const nextCard = deck.length > 0 ? deck[0] : null;
        deckImage.src = nextCard ? `assets/${nextCard.name.toLowerCase()}.png` : "assets/placeholder.png";
    } else {
        console.error("Deck image element not found.");
    }

    if (deckCountElement) {
        // Count the number of cards for each type
        const cardCounts = deck.reduce((counts, card) => {
            counts[card.name] = (counts[card.name] || 0) + 1;
            return counts;
        }, {});

        // Create a breakdown of card types
        const cardDetails = Object.entries(cardCounts)
            .map(([name, count]) => `${name}: ${count}`)
            .join("<br>");

        // Update the deck count display
        deckCountElement.innerHTML = `Total: ${deck.length}<br>${cardDetails}`;
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
function highlightTowers() {
	isDrawActive = true;
	
	const towers = document.querySelectorAll(".tower");
	
	towers.forEach((tower) => {
		tower.classList.add("highlight");
		
		const playerId = tower.closest(".player-section").querySelector("h2").textContent.split(" ")[1];
		tower.addEventListener(
			"click",
			(event) => handleTowerClick(event, playerId),
			{ once: true }
		);
	});
	setTowerState(true);
}

//PLACEMENT LOGIC
function handleTowerClick(event, playerId) {
    if (!isDrawActive || deck.length === 0) return;

    const tower = getTowerFromEvent(event);
    if (!tower) return;

    const towerId = getTowerId(tower);
    const card = deck.shift();

    const cardDiv = createCardElement(card, tower.childElementCount);
    tower.appendChild(cardDiv);

    // Process tower logic
    processTowerLogic(tower, card, playerId, towerId);

    // Final updates and display logic
    finaliseTurn(playerId, towerId, card, tower);
}

function getTowerFromEvent(event) {
	const tower = event.target.closest(".tower");
	if (!tower) {
		console.error("Tower not found");
	}
	return tower;
}

function getTowerId(tower) {
	return tower.id.includes("left") ? "left" : "right";
}

function createCardElement(card, cardIndex) {
	const cardDiv = document.createElement("div");
    cardDiv.classList.add("card-container");
    cardDiv.dataset.colour = card.colour; 
    cardDiv.style.setProperty("--card-index", cardIndex);
	
	const cardImage = document.createElement("img");
    cardImage.src = `assets/${card.name.toLowerCase()}.png`;
    cardDiv.appendChild(cardImage);

    return cardDiv;
}

function processTowerLogic(tower, card, playerId, towerId) {
	let cardsInTower =Array.from(tower.children).map((child) => ({
		element: child,
		colour: child.dataset.colour,
	}));
	
	let conflictIndex = checkForConflict(cardsInTower.map((c) => c.colour), card.colour);
	while (conflictIndex !== -1) {
		handleConflicts(tower, cardsInTower, conflictIndex, playerId);
		
		cardsInTower = Array.from(tower.children).map((child) => ({
			element: child,
			colour: child.dataset.colour,
		}));
		
		conflictIndex = checkForConflict(cardsInTower.map((c) => c.colour), card.colour);
	}

	const remainingCards = cardsInTower.map((c) => c.colour);
	updateTowerTally(playerId, towerId, remainingCards);
}
	
function handleConflicts(tower, cardsInTower, conflictIndex, playerId) {
	const discardedCards = cardsInTower.slice(conflictIndex);
	discard.push(...discardedCards.map((c) => c.colour));
	
	appendToLog(`Player ${playerId} discarded ${discardedCards.length} due to conflict.`);
	
	discardedCards.forEach((card) => card.element.remove());
}
	
function finaliseTurn(playerId, towerId, card, tower) {
	 appendToLog(`Player ${playerId} placed ${card.name} (${card.colour}) in ${towerId} tower.`);

    if (towerTotals[`player${playerId}`][towerId].black >= 4) {
        appendToLog(`Player ${playerId} has collected 4 Black cards in the ${towerId} tower and has won the game!`);
    } else if (towerTotals[`player${playerId}`][towerId].brown >= 4) {
        appendToLog(`Player ${playerId} has collected 4 Brown cards in the ${towerId} tower and has won the game!`);
    }
	
	setTowerState(false);
    const endTurnButton = document.getElementById(`end-turn-p${playerId}`);
    if (endTurnButton) setButtonState(endTurnButton, true);
	
    updateDeckDisplay();
    updateDiscardDisplay();
    isDrawActive = false;

    document.querySelectorAll(".tower").forEach((t) => t.classList.remove("highlight"));
}

function setTowerState(enabled) {
    const towers = document.querySelectorAll(".tower");

    towers.forEach((tower) => {
        if (enabled) {
            tower.classList.add("highlight"); // Highlight the towers when enabled.
        } else {
            tower.classList.remove("highlight"); // Remove highlight when disabled.

            // Remove event listeners by cloning and replacing the tower element.
            const newTower = tower.cloneNode(true);
            tower.parentNode.replaceChild(newTower, tower);
        }
    });
}

//DISCARD LOGIC
function checkForConflict(cards, newCardColour, debug = false) {
    if (debug) {
        console.log("Starting conflict check...");
        console.log("Cards in tower:", cards);
        console.log("New card colour:", newCardColour);
    }

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
	const cardsInput = cards.map(card => ({ name: card.name, count: card.dfCount }));
	createDeck(cardsInput);
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
	
	setupGameModal();
	setupButtonListeners();
	setButtonState(document.getElementById("draw-button-p1"), true);
    setButtonState(document.getElementById("draw-button-p2"), false);
    setButtonState(document.getElementById("end-turn-p1"), false);
    setButtonState(document.getElementById("end-turn-p2"), false);

    setTowerState(false); // Disable towers at the start
});

function setupGameModal() {
	const modal = document.getElementById("setup-modal");
    const form = document.getElementById("setup-form");

    // Populate card options
    const cardSelection = document.getElementById("card-selection");
    cards.forEach(card => {
        const optionDiv = document.createElement("div");
        optionDiv.classList.add("card-option");

        optionDiv.innerHTML = `
            <label for="${card.name}-quantity">${card.name} (${card.colour})</label>
            <input type="number" id="${card.name}-quantity" min="0" placeholder="Default: ${card["dfcount"]}">
        `;

        cardSelection.appendChild(optionDiv);
    });

    // Show the modal
    modal.style.display = "flex";

    // Handle form submission
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const cardsInput = cards.map(card => {
			const quantityInput = document.getElementById(`${card.name}-quantity`);
			return {
				name: card.name,
				count: parseInt(quantityInput.value) || card.dfCount,
			};
		});
		
		console.log("Deck created with user input:", cardsInput);
		
		createDeck(cardsInput);
		shuffleDeck();
		resetGame();
		
		modal.style.display = "none";
	});
}	

function setupButtonListeners() {
	const towers = document.querySelectorAll(".tower");
	if (towers.length === 0) {
		console.error("No towers found on the page.")
	}
	const drawButtonP1 = document.getElementById("draw-button-p1");
	const drawButtonP2 = document.getElementById("draw-button-p2");
	const endTurnButtonP1 = document.getElementById("end-turn-p1");
    const endTurnButtonP2 = document.getElementById("end-turn-p2");
	const shuffleButton = document.getElementById("shuffle");
	const resetButton = document.getElementById("reset");
	
	if (drawButtonP1) {
        drawButtonP1.addEventListener("click", () => {
            setButtonState(drawButtonP1, false);
            setTowerState(true);
            setButtonState(endTurnButtonP1, false);
        });
    }

    if (drawButtonP2) {
        drawButtonP2.addEventListener("click", () => {
            setButtonState(drawButtonP2, false);
            setTowerState(true);
            setButtonState(endTurnButtonP2, false);
        });
    }

    if (endTurnButtonP1) {
        endTurnButtonP1.addEventListener("click", () => {
            setTowerState(false);
            setButtonState(endTurnButtonP1, false);
            setButtonState(drawButtonP2, true);
        });
    }

    if (endTurnButtonP2) {
        endTurnButtonP2.addEventListener("click", () => {
            setTowerState(false);
            setButtonState(endTurnButtonP2, false);
            setButtonState(drawButtonP1, true);
        });
    }
	if (shuffleButton) shuffleButton.addEventListener("click", shuffleDeck);
	if (resetButton) resetButton.addEventListener("click", resetGame);
}