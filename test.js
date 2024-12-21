//VARIABLES
let deck 				= [];
let discard 			= [];
let isPlayerOneTurn		= true;
const drawButtonP1 		= document.getElementById("draw-button-p1");
const drawButtonP2 		= document.getElementById("draw-button-p2");
const endTurnButtonP1 	= document.getElementById("end-turn-p1");
const endTurnButtonP2 	= document.getElementById("end-turn-p2");
const shuffleButton 	= document.getElementById("shuffle");
const resetButton 		= document.getElementById("reset");
const towers 			= document.querySelectorAll(".tower");

//CARD DATA
const cards = [
	{ name: "Poocheyena", 	colour: "Black", 	value: 1,	dfcount: 11},
	{ name: "Larvitar", 	colour: "Brown", 	value: 1,	dfcount: 11},
	{ name: "Lotad", 		colour: "Blue", 	value: 0,	dfcount: 2},
	{ name: "Switch",		colour: "Item",		value: 0,	dfcount: 5},
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
    cardsInput.forEach(({ name, count }) => {
        const cardTemplate = cards.find(card => card.name === name);
        if (cardTemplate) {
            for (let i = 0; i < count; i++) {
                deck.push({ ...cardTemplate }); 
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
	towers.forEach((tower) => {
		tower.classList.add("highlight");
		tower.addEventListener(
			"click",
			(event) => draw(event, playerId),
			{ once: true }
		);
	});
}

function draw(event, playerId) {
	setButtonState(shuffleButton, false);
	setButtonState(drawButtonP1, false);
    setButtonState(drawButtonP2, false);
	
	const tower = event.target.closest(".tower"); //find nearest tower
	
	const towerId = tower.id.includes("left") 
						? "left" 
						: "right"; //find tower side
	const card = deck.shift(); //removes card from deck
	
	if (card.colour !== 'Item') {
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
		
	} else {
		const handDiv = document.querySelector(".hand");
		if (handDiv) {
			const cardDiv = document.createElement("div");
			cardDiv.classList.add("card-container");
			cardDiv.dataset.colour = card.colour;
	
			const cardImage = document.createElement("img");
			cardImage.src = `assets/${card.name.toLowerCase()}.png`;
			cardDiv.appendChild(cardImage);
	
			handDiv.appendChild(cardDiv);
		} 
	}
	resetTowerState();
	updateDeckDisplay();
}
	
function resetTowerState() {
    towers.forEach((tower) => {
        tower.classList.remove("highlight");
		const newTower = tower.cloneNode(true);
        tower.parentNode.replaceChild(newTower, tower);
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
