//VARIABLES
let deck 					= [];
let discard 				= [];
let isPlayerOneTurn			= true;
let activeTowerListeners 	= [];
const drawButtonP1 			= document.getElementById("draw-button-p1");
const drawButtonP2 			= document.getElementById("draw-button-p2");
const endTurnButtonP1 		= document.getElementById("end-turn-p1");
const endTurnButtonP2 		= document.getElementById("end-turn-p2");
const shuffleButton 		= document.getElementById("shuffle");
const resetButton 			= document.getElementById("reset");
const towers 				= document.querySelectorAll(".tower");
const hands = {
    player1: [],
    player2: []
};
const playerTowers = {
    player1: { left: [], right: [] },
    player2: { left: [], right: [] }
};
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

///CARD DATA
const cards = [
	{
		name: "Scruffle",
		colour: "Black",
		value: 1,
		dfcount: 11,
		action: function (tower) {
            const topCard = getTopCard(tower);
            if (topCard && topCard.colour === "Brown") {
                conflict(tower, this.name, this.colour);
            } else {
                placeCardOnTower(tower, this.color, this.name.toLowerCase());
            }
		}
	},
	{
		name: "Foravore",
		colour: "Brown",
		value: 1,
		dfcount: 11,
		action: function (tower) {
            const topCard = getTopCard(tower);
            if (topCard && topCard.colour === "Black") {
                conflict(tower, this.name, this.colour);
            } else {
                placeCardOnTower(tower, this.color, this.name.toLowerCase());
            }
        }
	},
	{
		name: "Toadl",
		colour: "Blue",
		value: 0,
		dfcount: 2,
		action: function (target) {
			placeCardOnTower(target, this.color, this.name.toLowerCase());
		}
	},
	{
		name: "Switch",
		colour: "Item",
		value: 0,
		dfcount: 5,
		action: function (target) {
			placeCardInHand(target, this.color, this.name.toLowerCase());
		}
	}
];

// INITIAL STATE FUNCTIONS
//SET UP DECK
/*function createDeck(cardsInput) {
    deck = []; 
    cardsInput.forEach(({ name, count }) => {
        const cardTemplate = cards.find(card => card.name === name);
        if (cardTemplate) {
            for (let i = 0; i < count; i++) {
                deck.push({ 
				name: cardTemplate.name, 
				action: cardTemplate.action.bind(cardTemplate), 
				colour: cardTemplate.colour });
            }
        }
    });
    return deck;
}
*/

function createDeck(cardsInput) {
	cardsInput.forEach(({ name, count }) => {
		const cardTemplate = cards.find(card => card.name === name);
			for (let i = 0; i < count; i++) {
				deck.push({...cardTemplate });
				}
			});
	return deck;
}

function shuffleDeck() {
	for (let i =deck.length -1; i>0; i--) {
		const j = Math.floor(Math.random() * (i+1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}
	console.log("Deck shuffled:", deck);
	updateDeckDisplay();
}

//GAME STATE DISPLAY 
function updateDeckDisplay() {
    const deckImage = document.querySelector("#next-card img");
    const deckCountElement = document.querySelector("#deck-count");

    if (deckImage) {
        const nextCard = deck.length > 0 
							? deck[0] 
							: null;
        deckImage.src = nextCard 
							? `assets/${nextCard.name.toLowerCase()}.png` 
							: "assets/placeholder.png";
    } 
	
    if (deckCountElement) {
        const cardCounts = deck.reduce((counts, card) => {
            counts[card.name] = (counts[card.name] || 0) + 1;
            return counts;
        }, {});

        const cardDetails = cards
            .map(card => `${card.name}: ${cardCounts[card.name] || 0}`)
            .join("<br>");

        deckCountElement.innerHTML = `Total: ${deck.length}<br>${cardDetails}`;
    } 
}

function updateDiscardDisplay() {
	const discardCountElement = document.querySelector("#discard-count");
	
	if (discardCountElement) {
		const cardCounts = discard.reduce((counts, card) => {
			counts[card.name] = (counts[card.name] || 0) + 1;
			return counts;
		}, {});
		
		const cardDetails = Object.entries(cardCounts)
            .map(([name, count]) => `${name}: ${count}`)
            .join("<br>");
		
		discardCountElement.innerHTML = `Total: ${discard.length}<br>{cardDetails}`;
	}
}

function setButtonState(button, enabled) {
    if (!button) return;

    if (enabled) {
        button.disabled = false;
        button.classList.remove("disabled");
    } else {
        button.disabled = true;
        button.classList.add("disabled");
    }
}

//GAME SETUP MODAL
function setupGameModal() {
	const modal = document.getElementById("setup-modal");
    const form = document.getElementById("setup-form");
	
	const cardSelection = document.getElementById("card-selection");
	cards.forEach(card => {
		const optionDiv = document.createElement("div"); //creates a HTML div for each CARD
		optionDiv.classList.add("card-option"); //adds a css element to format this Text
		
		optionDiv.innerHTML = `
			<label for="${card.name}-quantity">${card.name}</label>
			<input 
				type="number" 
				id="${card.name}-quantity" 
				min="0" 
				placeholder="${card.dfcount}">
			`;
			
			cardSelection.appendChild(optionDiv); //adds the divs to the HTML
	});
	
	modal.style.display = "flex";
	
	form.addEventListener("submit", (event) => {
		event.preventDefault(); //stops reloading of page automatically
		const userSelectedCards = cards.map(card => {
			const quantityInput = document.getElementById(`${card.name}-quantity`);
			return {
				name: card.name,
				count: parseInt(quantityInput.value) || card.dfcount,
			};
		});
	console.log(userSelectedCards);
	createDeck(userSelectedCards);
    shuffleDeck();
	modal.style.display = "none";
	});
}

//INITIAL STATE
document.addEventListener("DOMContentLoaded", () => {
	setupGameModal();
	shuffleButton.addEventListener("click", shuffleDeck);
	resetButton.addEventListener("click", setupGameModal);
	drawButtonP1.addEventListener("click", () => highlightTowers(1));
	setButtonState(drawButtonP1, true);
	setButtonState(drawButtonP2, false);
	setButtonState(endTurnButtonP1, false);
	setButtonState(endTurnButtonP2, false);
});

//DRAW LOGIC
function highlightTowers(playerId) {
	//remove existing listeners
	activeTowerListeners.forEach(({ element, listener }) => {
        element.removeEventListener("click", listener);
    });
    activeTowerListeners = [];
	
	//highlight towers and adds listeners
	towers.forEach((tower) => {
		tower.classList.add("highlight");
		const listener = (event) => draw(event, playerId);
        tower.addEventListener("click", listener, { once: true });
		activeTowerListeners.push({ element: tower, listener });
	});
}

function draw(event, playerId) {
    const tower = event.target.closest(".tower"); // Find nearest tower
    const towerId = tower.id.includes("1") ? "1" : "2"; // Get player ID from the tower
    const hand = document.getElementById(`player-${towerId}-hand`);
    const card = deck.shift(); // Remove top card from the deck

    if (card.action) {
        if (card.colour === "Item") {
            card.action(hand);
        } else {
            card.action(tower);
		}
	}
	
    resetTowerState();
    updateDeckDisplay();
}

//SHARED PLACEMENT FUNCTIONS
// to be updated
function getTopCard(tower) {
    const cardsInTower = Array.from(tower.children);
    if (cardsInTower.length === 0) return null;
    const topCardElement = cardsInTower[cardsInTower.length - 1];
    return { colour: topCardElement.dataset.colour, element: topCardElement };
}

function placeCardOnTower(tower, colour, name) {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card-container");
    cardDiv.dataset.colour = colour;
    cardDiv.style.setProperty("--card-index", tower.childElementCount);

    const cardImage = document.createElement("img");
    cardImage.src = `assets/${name}.png`;
    cardDiv.appendChild(cardImage);

    tower.appendChild(cardDiv);
	
	const placingPlayer = isPlayerOneTurn 
							? "player1" 
							: "player2";
	const targetPlayer = tower.id.includes("1") 
							? "player1" 
							: "player2";
    const towerSide = tower.id.includes("left") 
							? "left" 
							: "right";
    addToLog(`${placingPlayer} placed a ${name} card onto ${targetPlayer}'s ${towerSide} tower.`);
	
	const attemptingCard = cards.find((card) => card.name === name);
	
	playerTowers[targetPlayer][towerSide].push({...attemptingCard});
	
	resetTowerState();
}

function placeCardInHand(hand, colour, name) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("hand-card");
    cardElement.dataset.colour = colour;

    const cardImage = document.createElement("img");
    cardImage.src = `assets/${name}.png`;
    cardElement.appendChild(cardImage);
	
	hand.appendChild(cardElement);
	
	const placingPlayer = isPlayerOneTurn 
							? "player1" 
							: "player2";
	const targetPlayer = hand.id.includes("1") 
							? "player1" 
							: "player2";
    addToLog(`${placingPlayer} placed a ${name} card into ${targetPlayer}'s hand.`);
	
	const attemptingCard = cards.find((card) => card.name === name);
	hands[targetPlayer].push({...attemptingCard});
	
	resetTowerState();
}

//SWITCH TURNS
function resetTowerState() {
    towers.forEach((tower) => {
        tower.classList.remove("highlight");
    });
	
	setButtonState(shuffleButton, true);
	isPlayerOneTurn = !isPlayerOneTurn;
	
	if (isPlayerOneTurn) {
        setButtonState(drawButtonP1, true);
        setButtonState(drawButtonP2, false);
		drawButtonP2.addEventListener("click", () => highlightTowers(1));
    } else {
        setButtonState(drawButtonP1, false);
        setButtonState(drawButtonP2, true);
		drawButtonP2.addEventListener("click", () => highlightTowers(2));
    }
	
	logger();
}

//LOG
function addToLog(message) {
    const logContainer = document.getElementById("log-text");
    if (!logContainer) {
        console.error("Log container not found.");
        return;
    }

    const logEntry = document.createElement("div");
    logEntry.textContent = message;
    logContainer.appendChild(logEntry);

    logContainer.scrollTop = logContainer.scrollHeight;
}

//CONFLICT
function conflict(tower, attemptingCardName) {
	
	const placingPlayer = isPlayerOneTurn 
							? "player1" 
							: "player2";
	const targetPlayer = tower.id.includes("1") 
							? "player1" 
							: "player2";
    const towerSide = tower.id.includes("left") 
							? "left" 
							: "right";

	const cardsInTower = playerTowers[targetPlayer][towerSide];
    const blockCardIndex = cardsInTower.findIndex((card) =>
        ["Blue", "Green", "Yellow"].includes(card.colour)
    );
    const startIndex = blockCardIndex === -1 ? 0 : blockCardIndex;
	const cardsToDiscard = cardsInTower.splice(startIndex);
	discard.push(...cardsToDiscard);
	
	const attemptingCard = cards.find((card) => card.name === attemptingCardName);
    discard.push(attemptingCard);
	
	addToLog(`Conflict occurred! ${placingPlayer} placed a ${attemptingCardName} onto ${targetPlayer}'s ${towerSide} tower. ${cardsToDiscard.length+1} cards discarded.`);

	// Re-render the remaining tower cards visually
    playerTowers[targetPlayer][towerSide].forEach((card) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card-container");
        cardDiv.dataset.colour = card.colour;

        const cardImage = document.createElement("img");
        cardImage.src = `assets/${card.name.toLowerCase()}.png`;
        cardDiv.appendChild(cardImage);

        tower.appendChild(cardDiv);
    });
	
	resetTowerState();
}
/*    	
    cardsToDiscard.forEach((card) => {
        discard.push(card);
		});
        card.remove();
    });
	const attemptingCard = cards.find((card) => card.name === attemptingCardName);
	discard.push(attemptingCard);
	
	const towerElement = document.getElementById(tower.id);
    towerElement.innerHTML = "";
    playerTowers[targetPlayer][towerSide].forEach((card) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card-container");
        cardDiv.dataset.colour = card.colour;

        const cardImage = document.createElement("img");
        cardImage.src = `assets/${card.name.toLowerCase()}.png`;
        cardDiv.appendChild(cardImage);

        towerElement.appendChild(cardDiv);
    });    

*/

//CONSOLE LOG
function logger() {
console.log("Deck: ", deck.map(card => card.name));
console.log("Discard: ", discard.map(card => card.name));
console.log("PlayerTowers: ", playerTowers);
console.log("Hands: ", hands);
}