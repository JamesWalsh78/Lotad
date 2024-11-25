// Reference to the game box
const gameBox = document.getElementById('game-box');

// Toggle text on click
gameBox.addEventListener('click', () => {
    if (gameBox.textContent === 'Lotad') {
        gameBox.textContent = 'Card Game';
    } else {
        gameBox.textContent = 'Lotad';
    }
});