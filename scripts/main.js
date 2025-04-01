let answerKey = "";
let currentQuestion = 0;
let attempts = 0;
let score = 0;
let quizCode = "";

// Fetch and start the quiz
async function startQuiz() {
    quizCode = document.getElementById("quizCode").value.trim();
    if (!quizCode) {
        alert("Please enter a quiz code.");
        return;
    }

    answerKey = await fetchAnswerKey(quizCode);
    if (!answerKey) {
        alert("Quiz not found!");
        return;
    }

    document.getElementById("quiz-setup").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    
    loadQuestion();
}

// Load the next question
function loadQuestion() {
    if (currentQuestion >= answerKey.length) {
        alert(`Quiz completed! Your final score: ${score}`);
        location.reload();
        return;
    }

    attempts = 0;
    document.getElementById("question-number").textContent = `Question ${currentQuestion + 1}`;
    document.getElementById("feedback").textContent = "";
    document.getElementById("next-question").style.display = "none";
    updateScoreDisplay();  // Update live score display

    // Enable buttons and reset styles
    document.querySelectorAll(".option").forEach(btn => {
        btn.disabled = false;
        btn.style.backgroundColor = "gray";
        btn.onclick = () => checkAnswer(btn.dataset.option, btn);
    });
}

// Check the selected answer
function checkAnswer(selectedOption, button) {
    attempts++;

    // If the student selects the correct answer
    if (selectedOption === answerKey[currentQuestion]) {
        button.style.backgroundColor = "green";
        document.getElementById("feedback").textContent = "Correct!";
        
        // Update the score based on the attempt number (4, 2, 1, 0)
        if (attempts === 1) {
            score += 4; // First attempt
        } else if (attempts === 2) {
            score += 2; // Second attempt
        } else if (attempts === 3) {
            score += 1; // Third attempt
        } else if (attempts === 4) {
            score += 0; // Fourth attempt
        }

        updateScoreDisplay(); // Update live score display

        // Disable all options once the correct answer is selected
        document.querySelectorAll(".option").forEach(btn => {
            btn.disabled = true;
        });

        // Show the Next Question button
        document.getElementById("next-question").style.display = "block";
    } else {
        button.style.backgroundColor = "red";
        if (attempts === 4) {
            document.getElementById("feedback").textContent = "Incorrect! Moving to next question.";
            score -= 1; // Deduct 1 mark if all attempts are used up
            updateScoreDisplay(); // Update live score display
            setTimeout(nextQuestion, 1000);
        }
    }
}

// Update the live score display
function updateScoreDisplay() {
    document.getElementById("live-score").textContent = `Score: ${score}`;
}

// Move to the next question
function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}

// Initialize canvas for scratch effect
const canvasElements = document.querySelectorAll('.scratch-canvas');

// Add event listeners for both touch and mouse events
canvasElements.forEach(canvas => {
    const ctx = canvas.getContext('2d');
    let isScratching = false;

    // Set canvas size (60x60 pixels)
    canvas.width = 60;
    canvas.height = 60;

    // Create the scratchable overlay (gray layer)
    ctx.fillStyle = '#999';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Function to handle the scratching
    const scratchHandler = (event) => {
        if (!isScratching) return;

        // Get position based on touch or mouse event
        let x, y;
        if (event.type.startsWith('touch')) {
            x = event.touches[0].clientX - canvas.offsetLeft;
            y = event.touches[0].clientY - canvas.offsetTop;
        } else {
            x = event.clientX - canvas.offsetLeft;
            y = event.clientY - canvas.offsetTop;
        }

        // Clear a small area where the user is "scratching"
        ctx.clearRect(x - 10, y - 10, 20, 20);
    };

    // Event listeners for mouse and touch events
    canvas.addEventListener('mousedown', (e) => {
        isScratching = true;
        scratchHandler(e);
    });
    canvas.addEventListener('mousemove', (e) => {
        if (isScratching) scratchHandler(e);
    });
    canvas.addEventListener('mouseup', () => {
        isScratching = false;
    });

    canvas.addEventListener('touchstart', (e) => {
        isScratching = true;
        scratchHandler(e);
    });
    canvas.addEventListener('touchmove', (e) => {
        if (isScratching) scratchHandler(e);
    });
    canvas.addEventListener('touchend', () => {
        isScratching = false;
    });
});
