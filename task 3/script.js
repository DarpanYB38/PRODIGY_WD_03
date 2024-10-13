const cells = document.querySelectorAll('[data-cell]');
const gameStatus = document.getElementById('game-status');
const resetButton = document.getElementById('reset');
const playerVsPlayerBtn = document.getElementById('playerVsPlayer');
const playerVsComputerBtn = document.getElementById('playerVsComputer');

let currentPlayer = 'X';
let gameActive = true;
let gameMode = 'PvP';  // Default game mode: Player vs Player
let gameState = ["", "", "", "", "", "", "", "", ""];

// Winning combinations for the game
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Function to handle cell clicks (for both PvP and PvC modes)
function handleClick(e) {
    const cell = e.target;
    const cellIndex = Array.from(cells).indexOf(cell);

    // If the cell is already filled or the game is over, do nothing
    if (gameState[cellIndex] !== "" || !gameActive) return;

    // Update the cell with the current player's symbol and the game state
    gameState[cellIndex] = currentPlayer;
    cell.textContent = currentPlayer;

    // Check for a win or a draw
    checkGameResult();

    // If playing against computer, let the computer make a move
    if (gameMode === 'PvC' && currentPlayer === 'O' && gameActive) {
        setTimeout(computerMove, 500);  // Slight delay for better experience
    }
}

// Function to check game result (win/draw)
function checkGameResult() {
    let roundWon = false;
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        gameStatus.textContent = `Player ${currentPlayer} Wins!`;
        gameActive = false;
        return;
    }

    // Check for draw
    if (!gameState.includes("")) {
        gameStatus.textContent = "It's a Draw!";
        gameActive = false;
        return;
    }

    // Switch players
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    gameStatus.textContent = `Player ${currentPlayer}'s Turn`;
}

// Function for the computer's move (random selection of an empty cell)
function computerMove() {
    let availableCells = [];
    gameState.forEach((cell, index) => {
        if (cell === "") availableCells.push(index);
    });

    if (availableCells.length > 0) {
        const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        gameState[randomIndex] = 'O';
        cells[randomIndex].textContent = 'O';
        checkGameResult();
    }
}

// Restart the game
function restartGame() {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameStatus.textContent = `Player X's Turn`;
    cells.forEach(cell => cell.textContent = "");
}

// Set game mode to "Player vs Player"
playerVsPlayerBtn.addEventListener('click', () => {
    gameMode = 'PvP';
    restartGame();
    playerVsPlayerBtn.classList.add('active-mode');
    playerVsComputerBtn.classList.remove('active-mode');
});

// Set game mode to "Player vs Computer"
playerVsComputerBtn.addEventListener('click', () => {
    gameMode = 'PvC';
    restartGame();
    playerVsComputerBtn.classList.add('active-mode');
    playerVsPlayerBtn.classList.remove('active-mode');
});

// Add event listeners to each cell
cells.forEach(cell => cell.addEventListener('click', handleClick));

// Add event listener to the reset button
resetButton.addEventListener('click', restartGame);
