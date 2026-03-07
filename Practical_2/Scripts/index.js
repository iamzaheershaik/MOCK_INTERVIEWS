
let secretNumber = 0;
let guessesLeft = 0;
let attempts = 0;
let maxGuesses = 0;
let maxNumber = 0;
let gameOver = false;
let previousGuesses = [];
let difficulty = '';

const difficulties = {
    easy: { max: 10, guesses: 5 },
    medium: { max: 100, guesses: 8 },
    hard: { max: 1000, guesses: 10 }
};
function startGame(level) {
    difficulty = level;
    const settings = difficulties[level];
    maxNumber = settings.max;
    maxGuesses = settings.guesses;
    secretNumber = Math.floor(Math.random() * maxNumber) + 1;
    guessesLeft = maxGuesses;
    attempts = 0;
    gameOver = false;
    previousGuesses = [];
    
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    document.getElementById('result').style.display = 'none';
    
    updateGameDisplay();
    document.getElementById('userGuess').focus();
}

function updateGameDisplay() {
    document.getElementById('instructions').textContent = 'Guess a number between 1 and ' + maxNumber;
    document.getElementById('guessesLeft').textContent = guessesLeft;
    document.getElementById('attempts').textContent = attempts;
    document.getElementById('feedback').textContent = '';
    document.getElementById('userGuess').value = '';
}
function handleGuess() {
    if (gameOver) return;
    const userGuess = parseInt(document.getElementById('userGuess').value);
    if (isNaN(userGuess) || userGuess < 1 || userGuess > maxNumber) {
        document.getElementById('feedback').textContent = 'Please enter a valid number between 1 and ' + maxNumber;
        return;
    }
    attempts++;
    guessesLeft--;
    previousGuesses.push(userGuess);
    const feedbackElement = document.getElementById('feedback');
    if (userGuess === secretNumber) {
        feedbackElement.textContent = 'Correct! You Won!';
        gameOver = true;
        showResultScreen(true);
    } else if (userGuess < secretNumber) {
        feedbackElement.textContent = 'Too Low! Try a higher number.';
        if (guessesLeft <= 0) {
            gameOver = true;
            showResultScreen(false);
        }
    } else {
        feedbackElement.textContent = 'Too High! Try a lower number.';
        if (guessesLeft <= 0) {
            gameOver = true;
            showResultScreen(false);
        }
    }
    document.getElementById('guessesLeft').textContent = guessesLeft;
    document.getElementById('attempts').textContent = attempts;
    updatePreviousGuesses();
    document.getElementById('userGuess').value = '';
}


function updatePreviousGuesses() {
    const previousGuessesElement = document.getElementById('previousGuesses');
    if (previousGuesses.length > 0) {
        previousGuessesElement.textContent = 'Previous Guesses: ' + previousGuesses.join(', ');
    } else {
        previousGuessesElement.textContent = '';
    }
}


function showResultScreen(won) {
    setTimeout(() => {
        document.getElementById('menu').style.display = 'none';
        document.getElementById('game').style.display = 'none';
        document.getElementById('result').style.display = 'block';
        
        const resultMessage = document.getElementById('resultMessage');
        const resultDetails = document.getElementById('resultDetails');
        
        if (won) {
            resultMessage.textContent = 'You Won!';
            resultDetails.innerHTML = 'You guessed the number ' + secretNumber + ' in ' + attempts + ' attempts! Guesses left: ' + guessesLeft;
        } else {
            resultMessage.textContent = 'Game Over!';
            resultDetails.innerHTML = 'The secret number was: ' + secretNumber + '<br>You made ' + attempts + ' attempts.<br>Your guesses: ' + previousGuesses.join(', ');
        }
    }, 300);
}
function resetGame() {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('game').style.display = 'none';
    document.getElementById('result').style.display = 'none';
    previousGuesses = [];
}


function handleKeyPress(event) {
    if (event.key === 'Enter' && !gameOver) {
        handleGuess();
    }
}
