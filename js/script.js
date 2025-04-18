// Sample texts for typing tests
const texts = [
    "The quick brown fox jumps over the lazy dog. Packed with vitamins and minerals, the nutritious breakfast cereal claimed to improve concentration and energy throughout the day.",
    "In a world full of technology, sometimes we forget to appreciate the simple things in life, like watching a sunset or enjoying a cup of coffee with friends.",
    "Programming is both an art and a science. It requires logical thinking and creative problem-solving skills to develop efficient and elegant solutions.",
    "The library was a quiet sanctuary for many students preparing for their final exams. The soft sound of pages turning and pens scratching against paper filled the air.",
    "Climate change poses significant challenges to our planet. Scientists around the world are working tirelessly to develop sustainable solutions to mitigate its effects."
];

// DOM Elements
const textDisplay = document.getElementById('text-display');
const inputField = document.getElementById('input-field');
const wpmElement = document.getElementById('wpm');
const cpmElement = document.getElementById('cpm');
const accuracyElement = document.getElementById('accuracy');
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('start-btn');
const restartButton = document.getElementById('restart-btn');
const changeTextButton = document.getElementById('change-text-btn');

// Variables
let timer;
let timeLeft = 60;
let isTyping = false;
let currentText = '';
let typedCharacters = 0;
let correctCharacters = 0;
let currentTextIndex = 0;

// Initialize
function init() {
    inputField.disabled = true;
    selectRandomText();
    displayText();
}

// Select a random text from the array
function selectRandomText() {
    currentTextIndex = Math.floor(Math.random() * texts.length);
    currentText = texts[currentTextIndex];
}

// Display text in the text display area with character spans
function displayText() {
    textDisplay.innerHTML = '';
    currentText.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        textDisplay.appendChild(charSpan);
    });
}

// Start the typing test
function startTest() {
    isTyping = true;
    timeLeft = 60;
    typedCharacters = 0;
    correctCharacters = 0;
    
    // Enable input and clear it
    inputField.disabled = false;
    inputField.value = '';
    inputField.focus();
    
    // Reset stats
    wpmElement.innerText = '0';
    cpmElement.innerText = '0';
    accuracyElement.innerText = '0%';
    
    // Start timer
    startTimer();
    
    // Disable start button during test
    startButton.disabled = true;
}

// Start the countdown timer
function startTimer() {
    timerElement.innerText = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft;
        
        // Calculate stats as user types
        calculateStats();
        
        if (timeLeft === 0) {
            endTest();
        }
    }, 1000);
}

// End the typing test
function endTest() {
    isTyping = false;
    clearInterval(timer);
    inputField.disabled = true;
    startButton.disabled = false;
    
    // Final stats calculation
    calculateStats();
}

// Restart the typing test
function restartTest() {
    clearInterval(timer);
    isTyping = false;
    inputField.value = '';
    displayText();
    
    // Reset stats
    wpmElement.innerText = '0';
    cpmElement.innerText = '0';
    accuracyElement.innerText = '0%';
    timerElement.innerText = '60';
    
    timeLeft = 60;
    startButton.disabled = false;
    inputField.disabled = true;
}

// Change the test text
function changeText() {
    restartTest();
    
    // Get a new text, ensuring it's different from the current one
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * texts.length);
    } while (newIndex === currentTextIndex && texts.length > 1);
    
    currentTextIndex = newIndex;
    currentText = texts[currentTextIndex];
    displayText();
}

// Calculate WPM, CPM, and Accuracy
function calculateStats() {
    if (typedCharacters === 0) return;
    
    // Words per minute (assuming average word length of 5 characters)
    const timeInMinutes = (60 - timeLeft) / 60;
    if (timeInMinutes === 0) return;
    
    const wpm = Math.round(typedCharacters / 5 / timeInMinutes);
    wpmElement.innerText = wpm;
    
    // Characters per minute
    const cpm = Math.round(typedCharacters / timeInMinutes);
    cpmElement.innerText = cpm;
    
    // Accuracy
    const accuracy = Math.round((correctCharacters / typedCharacters) * 100);
    accuracyElement.innerText = `${accuracy}%`;
}

// Check the typed text against the original text
function checkText() {
    const inputText = inputField.value;
    const characters = textDisplay.querySelectorAll('span');
    
    typedCharacters = inputText.length;
    correctCharacters = 0;
    
    for (let i = 0; i < characters.length; i++) {
        // Remove all existing classes
        characters[i].className = '';
        
        if (i < inputText.length) {
            // Mark as correct or incorrect
            if (inputText[i] === characters[i].innerText) {
                characters[i].classList.add('correct');
                correctCharacters++;
            } else {
                characters[i].classList.add('incorrect');
            }
        }
    }
    
    // Mark the current character
    if (inputText.length < characters.length) {
        characters[inputText.length].classList.add('current');
    }
    
    // Calculate stats as user types
    if (isTyping) {
        calculateStats();
    }
    
    // Check if user has completed the text
    if (inputText.length === currentText.length) {
        endTest();
    }
}

// Event Listeners
startButton.addEventListener('click', startTest);
restartButton.addEventListener('click', restartTest);
changeTextButton.addEventListener('click', changeText);
inputField.addEventListener('input', checkText);

// Initialize on page load
window.onload = init;