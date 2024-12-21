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

//CARD DATA
const cards = [
	{
		name: "Poocheyena",
		colour: "Black",
		value: 1,
		dfcount: 11,
		action: (tower) => placeCardOnTower(tower, "Black", "poocheyena")
	},
	{
		name: "Larvitar",
		colour: "Brown",
		value: 1,
		dfcount: 11,
		action: (tower) => placeCardOnTower(tower, "Brown", "larvitar")
	},
	{
		name: "Lotad",
		colour: "Blue",
		value: 0,
		dfcount: 2,
		action: (tower) => placeCardOnTower(tower, "Blue", "lotad")
	},
	{
		name: "Switch",
		colour: "Item",
		value: 0,
		dfcount: 5,
		action: (handDiv) => placeCardInHand(handDiv, "Item", "switch")
	}
];

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

// INITIAL STATE FUNCTIONS
//SET UP DECK
function createDeck(cardsInput) {
    deck = []; 
    cardsInput.forEach(({ name, count}) => {
        const cardTemplate = cards.find(card => card.name === name);
        if (cardTemplate) {
            for (let i = 0; i < count; i++) {
                deck.push({ name: cardTemplate.name, action: cardTemplate.action });
            }
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
    const handDiv = document.querySelector(`.hand.player-${playerId}`); // Player-specific hand
    const card = deck.shift(); // Remove top card from the deck

    // Call the specific card action
    if (card.action) {
        if (card.colour.toLowerCase() === "item") {
            card.action(handDiv);
        } else {
            card.action(tower);
		}
	}
	
    resetTowerState();
    updateDeckDisplay();
}

// Shared function for placing a card on a tower
function placeCardOnTower(tower, colour, name) {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card-container");
    cardDiv.dataset.colour = colour;
    cardDiv.style.setProperty("--card-index", tower.childElementCount);

    const cardImage = document.createElement("img");
    cardImage.src = `assets/${name}.png`;
    cardDiv.appendChild(cardImage);

    tower.appendChild(cardDiv);
}

// Shared function for placing a card in the player's hand
function placeCardInHand(handDiv, colour, name) {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card-container");
    cardDiv.dataset.colour = colour;

    const cardImage = document.createElement("img");
    cardImage.src = `assets/${name}.png`;
    cardDiv.appendChild(cardImage);

    handDiv.appendChild(cardDiv);
}

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
}
