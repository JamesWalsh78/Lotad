//VARIABLES
let deck = [];
let discard = [];
const drawButtonP1 = document.getElementById("draw-button-p1");
const drawButtonP2 = document.getElementById("draw-button-p2");
const endTurnButtonP1 = document.getElementById("end-turn-p1");
const endTurnButtonP2 = document.getElementById("end-turn-p2");
const shuffleButton = document.getElementById("shuffle");
const resetButton = document.getElementById("reset");

//CARD DATA
const cards = [
	{ name: "Poocheyena", 	colour: "Black", 	value: 1,	dfcount: 11},
	{ name: "Larvitar", 	colour: "Brown", 	value: 1,	dfcount: 11},
	{ name: "Lotad", 		colour: "Blue", 	value: 0,	dfcount: 2},
];

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
	shuffleButton.addEventListener("click", setupGameModal);
	setButtonState(drawButtonP1, true);
	setButtonState(drawButtonP2, false);
	setButtonState(endTurnButtonP1, false);
	setButtonState(endTurnButtonP2, false);
});

