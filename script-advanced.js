let deck = [];
let isDrawActive = false;

function createDeck() {
    deck = [];
    for (let i = 0; i < 8; i++) deck.push("Poocheyena");
    for (let i = 0; i < 10; i++) deck.push("Larvitar");
    for (let i = 0; i < 3; i++) deck.push("Lotad");
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    updateDeckDisplay();
}

function updateDeckDisplay() {
    const nextCard = deck.length > 0 ? deck[0] : "back";
    document.getElementById("next-card").querySelector("img").src = `assets/${nextCard.toLowerCase()}.png`;

    document.getElementById("poocheyena-count").textContent = deck.filter(card => card === "Poocheyena").length;
    document.getElementById("larvitar-count").textContent = deck.filter(card => card === "Larvitar").length;
    document.getElementById("lotad-count").textContent = deck.filter(card => card === "Lotad").length;
}

function showDrawInstruction() {
    const drawInstruction = document.getElementById("draw-instruction");
    drawInstruction.textContent = "Select a tower to place the next card.";
    drawInstruction.style.display = "block";
    isDrawActive = true;
    document.querySelectorAll(".tower-title").forEach(title => {
        title.classList.add("highlight");
        title.addEventListener("click", handleTowerClick, { once: true });
    });
}

function handleTowerClick(event) {
    if (!isDrawActive || deck.length === 0) return;

    const towerId = event.target.id.replace("-title", "");
    const tower = document.getElementById(towerId);
    const card = deck.shift();

    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card-container");
    cardDiv.style.setProperty("--card-index", tower.childElementCount);

    const cardImage = document.createElement("img");
    cardImage.src = `assets/${card.toLowerCase()}.png`;
    cardDiv.appendChild(cardImage);

    tower.appendChild(cardDiv);

    updateDeckDisplay();
	
    const drawInstruction = document.getElementById("draw-instruction");
	const logEntry = `${card} was placed on ${towerId.replace("-", " ")}.`;
	drawInstruction.textContent += `\n${logEntry}`; // Append the new entry
	drawInstruction.style.display = "block"; // Ensure the log is visible

    isDrawActive = false;
	
	// Remove the 'highlight' class from all tower titles
	document.querySelectorAll(".tower-title").forEach(title => {
    title.classList.remove("highlight");
    title.removeEventListener("click", handleTowerClick); // Remove the click event listeners
});

}

function resetGame() {
    createDeck();
    shuffleDeck();
    document.querySelectorAll(".tower").forEach(tower => (tower.innerHTML = ""));
    updateDeckDisplay();
}

document.getElementById("draw-button").addEventListener("click", showDrawInstruction);
document.getElementById("shuffle-button").addEventListener("click", shuffleDeck);
document.getElementById("reset-button").addEventListener("click", resetGame);

resetGame();
