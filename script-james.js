let deck = []
let discard = []
let isDrawActive = false;

function createDeck() {
	deck = [];
	for (let i=0; i<11; i++) deck.push("Poocheyena");
	for (let i=0; i<11; i++) deck.push("Larvitar");
	for (let i=0; i<2; i++) deck.push("Lotad");
}

function shuffleDeck() {
	for (let i =deck.length -1; i>0; i--) {
		const j = Math.floor(Math.random() * (i+1));
		[deck[i], deck[j]] = [deck[j], deck[i]];
	}
	updateDeckDisplay();
}

function updateDeckDisplay() {
	const nextCard = deck.length > 0 ? deck[0] : "back";
	const deckImage = document.querySelector("#next-card img");
	
	if (deckImage) {
		deckImage.src = `assets/${nextCard.toLowerCase()}.png`;
		deckImage.onerror = () => {
			deckImage.src = "assets/placeholder.png";
		};
	} else {
		console.error("Deck image element not found.")
	}
	
	const deckCountElement = document.querySelector("#deck-count");
	if (deckCountElement) {
		deckCountElement.innerHTML = `Total: ${deck.length}<br>Poocheyena: ${deck.filter(c => c === "Poocheyena").length}<br>Larvitar: ${deck.filter(c => c === "Larvitar").length}<br>Lotad: ${deck.filter(c => c === "Lotad").length}`;
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

function highlightTowers(playerId) {
    isDrawActive = true;
    const towers = document.querySelectorAll(`#player-${playerId}-left-tower, #player-${playerId}-right-tower`);
    towers.forEach((tower) => {
        tower.classList.add("highlight");
        tower.addEventListener(
            "click",
            (event) => handleTowerClick(event, playerId),
            { once: true }
        );
    });
}

function handleTowerClick(event, playerId) {
	if (!isDrawActive || deck.length ===0) return;
	
	const tower = event.target.closest(".tower");
	if (!tower) {
		console.error("Tower not found.");
		return;
	}
	
	const card = deck.shift();
	
	const cardDiv = document.createElement("div");
	cardDiv.classList.add("card-container");
	cardDiv.style.setProperty("--card-index", tower.childElementCount);
	
	const cardImage = document.createElement("img");
	cardImage.src = `assets/${card.toLowerCase()}.png`;
	cardDiv.appendChild(cardImage);
	
	tower.appendChild(cardDiv);
	appendToLog(`${card} was placed in ${tower.id}.`);
	
	updateDeckDisplay();
	updateDiscardDisplay();
	isDrawActive = false;
	
	document.querySelectorAll(".tower").forEach((t) => t.classList.remove("highlight"));
}

function resetGame() {
	createDeck();
	shuffleDeck();
	discard = [];
	document.querySelectorAll(".tower").forEach(tower => (tower.innerHTML = ""));
	const logText = document.querySelector("log-text");
	if (logText) logText.innerHTML = "";
	updateDeckDisplay();
	updateDiscardDisplay();
}

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