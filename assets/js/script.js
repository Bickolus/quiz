// Declaring variables, mostly for html elements
let header = document.querySelector("header");
let countdown = document.querySelector("#countdown-timer");
let startContainer = document.querySelector("#start-container");
let questionsContainer = document.querySelector("#questions-container");
let questionCard = document.querySelector("#questions-card");
let questionEle = document.querySelector("#question");
let choicesEle = document.querySelector("#choices");
let responseEle = document.querySelector("#response");
let finishedContainer = document.querySelector("#finished-container");
let initials = document.querySelector("#initials");
let highscoresContainer = document.querySelector("#highscores-container");
let emptyHighscores = document.querySelector("#empty-highscores-list");
let highscoresList = document.querySelector("#highscores-list");
let finalHighscore = document.querySelector("#score");

// Declaring variables for buttons
let startButton = document.querySelector("#start-button");
let submitButton = document.querySelector("#submit-button");
let tryAgainButton = document.querySelector("#try-again-button");
let clearButton = document.querySelector("#clear-button");

// Other variables important for the quiz
let qListCurrent = []; // This holds the array used for calculating and putting down question and buttons
let qIndex = 0; // This is used to determine what question the user is on
let qCard = {}; // This holds all the info for the question
let timer = 60;
let score = 0;

// List of quiz questions, you can add as many as you want provided they are in this format
let qList = [
    {
        question: "Who invented JavaScript?",
        answers: [
            "Douglas Crockford",
            "Sheryl Sandberg",
            "Brendan Eich",
            "Beebo the Goblin",
            "I don't care..."
        ],
        rightAnswer: "Brendan Eich"
    },
    {
        question: "Which of the following is correct about features of JavaScript?",
        answers: [
            "JavaScript is a lightweight, interpreted programming language.",
            "JavaScript is designed for creating network-centric applications.",
            "JavaScript is complementary to and integrated with Java.",
            "All of the above."
        ],
        rightAnswer: "All of the above."
    },
    {
        question: "Which of the following function of Array object removes the last element from an array and returns that element?",
        answers: [
            "pop()",
            "push()",
            "join()",
            "map()"
        ],
        rightAnswer: "pop()"
    },
    {
        question: "Which of the following function of Array object returns a string representing the array and its elements?",
        answers: [
            "toSource()",
            "sort()",
            "splice()",
            "toString()"
        ],
        rightAnswer: "toString()"
    }
    
];

// This shows/reveals an element
function showEle(element) {
    element.removeAttribute("class", "hidden");
}

// This hides the element by setting it to a class that has the css set to display:none
function hideEle(element) {
    element.setAttribute("class", "hidden");
}

// This function is a while loop that clears all children elements within the element given
function clearList(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// This function checks whether the answer clicked is correct or not
function checkAnswer(event) {
    let chosenEle = event.target;
    let chosenText = chosenEle.textContent;

    if (responseEle.firstChild !== null) {
        responseEle.removeChild(responseEle.firstChild);
    }

    if (chosenText === qCard.rightAnswer) {
        let responseMsg = document.createElement('p');
        responseEle.appendChild(responseMsg);
        responseMsg.innerText = "Your last answer was correct! Try this one.";
    } else {
        let responseMsg = document.createElement('p');
        responseEle.appendChild(responseMsg);
        responseMsg.innerText = "Your last answer was incorrect! 10 second penalty! Try this one."
        timer -= 10;
    }
}

// This function converts timer to score
function finalScore() {
    if (timer < 0) {
        timer = 0;
    }
    return score = timer;
}

// This function shows the container with the final score and the input for initials
function showScoreContainer(scoreValue) {
    hideEle(questionCard);
    hideEle(header);
    showEle(finishedContainer);

    finalHighscore.innerText = scoreValue;
}

// This function shows the highscores and the locally stored highscores list
function showHighscores() {
    let savedScoreLocal = localStorage.getItem("high scores");
    let highscoresArray = JSON.parse(savedScoreLocal);

    hideEle(header);
    hideEle(startContainer);
    hideEle(questionCard);
    hideEle(finishedContainer);
    showEle(highscoresContainer);

    // This checks if any high scores are stored in local storage
    if (savedScoreLocal === null) {
        return;
    }

    for (let i = 0; i < highscoresArray.length; i++) {
        let eachHighscore = document.createElement("li");
        eachHighscore.innerText = highscoresArray[i].userScore + " - " + highscoresArray[i].userInitials;
        highscoresList.appendChild(eachHighscore);
    }
}

// This function stores highscore in local storage after entering initials
function storeHighscores(event) {
    event.preventDefault();

    // This forces user to enter something in the initials input
    if (initials.value === "") {
        alert("Please do not leave this empty.");
        return;
    }

    hideEle(finishedContainer);
    showEle(highscoresContainer);
    
    // This part stores it into local storage
    let savedScoreLocal = localStorage.getItem("high scores");
    let highscoresArray;
    let user = {
        userInitials: initials.value,
        userScore: finalHighscore.textContent
    };

    if (savedScoreLocal === null) {
        highscoresArray = [];
    } else {
        highscoresArray = JSON.parse(savedScoreLocal);
    }

    highscoresArray.push(user);

    // This turns array into string so it can be locally stored
    let highscoresArrayString = JSON.stringify(highscoresArray);
    window.localStorage.setItem("high scores", highscoresArrayString);

    showHighscores();
}

// This function deletes local storage of high scores
function clearHighscores() {
    clearList(highscoresList);
    showEle(emptyHighscores);
    window.localStorage.removeItem("high scores");

}

// This function begins the clock
function startTimer() {
    timeInterval = setInterval(function() {
        countdown.textContent = timer;
        timer--;
 
        if (timer < 0) {
            score = 0;
            showScoreContainer(score);
            questionEle.textContent = '';
            clearInterval(timeInterval);

        }
    }, 1000);
}


// This function clears the question and puts in the next one
function nextQuestion() {
    qCard = qListCurrent[qIndex];
    questionEle.innerText = qCard.question;

    for (i = 0; i < qCard.answers.length; i++) {
        let buttonEle = document.createElement('button');
        buttonEle.setAttribute("class","button");
        buttonEle.innerText = qCard.answers[i];
        buttonEle.addEventListener("click", function() {
            checkAnswer(event);
            nextChoices();
        });
        choicesEle.appendChild(buttonEle);
    }
}

// This function clears buttons and put in new ones with the next question
function nextChoices() {
    qIndex++;
    if (qIndex < qListCurrent.length) {
        clearList(choicesEle);
        nextQuestion();
    } else {
        finalScore();
        clearList(choicesEle);
        showScoreContainer(score);
        clearInterval(timeInterval);
    }
}

// This function starts the quiz
function start() {
    qListCurrent = qList
    hideEle(startContainer);
    showEle(questionCard);
    startTimer();
    nextQuestion();
}

// Resets quiz to initial values so that the quiz works just like it does the first time you load it
function reset() {
    timer = 60;
    qIndex = 0;
    countdown.textContent = timer;
    qListCurrent = [];
    qCard = {};
    initials.value = "";
    
    clearList(choicesEle);
    questionEle.textContent = '';
    if (responseEle.firstElementChild.innerText != null) {
        responseEle.firstElementChild.innerText = ""
    };
    hideEle(highscoresContainer);
    hideEle(finishedContainer);
    hideEle(emptyHighscores);
    showEle(header);
    showEle(startContainer);
}

// Event listeners for the various buttons
startButton.addEventListener("click", start);
tryAgainButton.addEventListener("click", reset);
clearButton.addEventListener("click", clearHighscores);
submitButton.addEventListener("click", function() {
    storeHighscores(event);
})
