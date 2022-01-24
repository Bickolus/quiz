let header = document.querySelector("header");
let countdown = document.querySelector("#countdown-timner");
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
let viewHighscore = document.querySelector("#view-highscores");

let startButton = document.querySelector("#start-button");
let submitButton = document.querySelector("#submit-button");
let tryAgainButton = document.querySelector("#try-again-button");
let clearButton = document.querySelector("#clear-button");

let qListCurrent = [];
let qIndex = 0;
let qCard = {};
let timer = 60;
let score = 0;

let qList = [
    {
        question: "Who invented JavaScript?",
        answers: [
            "Douglas Crockford",
            "Sheryl Sandberg",
            "Brendan Eich",
            "Beebo the Goblin"
        ],
        rightAnswer: "Brendan Eich"
    },
    {
        question: "Which one of these is a JavaScript package manager?",
        answers: [
            "Node.js",
            "TypeScript",
            "Dingdong",
            "npm"
        ],
        rightAnswer: "npm"
    },
    {
        question: "Which is the right answer?",
        answers: [
            "Not this one",
            "Not this one",
            "Not this one",
            "This one"
        ],
        rightAnswer: "This one"
    }
    
];

function showEle(element) {
    element.removeAttribute("class", "hidden");
}

function hideEle(element) {
    element.setAttribute("class", "hidden");
}

function clearList(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

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

function finalScore() {
    if (timer < 0) {
        timer = 0;
    }
    return score = timer;
}

function showScoreContainer(scoreValue) {
    hideEle(questionCard);
    hideEle(header);
    showEle(finishedContainer);

    finalHighscore.innerText = scoreValue;
}

function showHighscores() {
    let savedScoreLocal = localStorage.getItem("high scores");
    let highscoresArray = JSON.parse(savedScoreLocal);

    hideEle(header);
    hideEle(startContainer);
    hideEle(questionCard);
    hideEle(finishedContainer);
    showEle(highscoresContainer);

    if (savedScoreLocal === null) {
        return;
    }

    for (let i = 0; i < highscoresArray.length; i++) {
        let eachHighscore = document.createElement("li");
        eachHighscore.innerText = highscoresArray[i].userScore + " - " + highscoresArray[i].userInitials;
        highscoresList.appendChild(eachHighscore);
    }
}

function storeHighscores(event) {
    event.preventDefault();

    if (initials.value === "") {
        alert("Please do not leave this empty.");
        return;
    }

    hideEle(finishedContainer);
    showEle(highscoresContainer);
    
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

    let highscoresArrayString = JSON.stringify(highscoresArray);
    window.localStorage.setItem("high scores", highscoresArrayString);

    showHighscores();
}

function clearHighscores() {
    clearList(highscoresList);
    showEle(emptyHighscores);
    window.localStorage.removeItem("high scores");

}

function startTimer() {
    timeInterval = setInterval(function() {
        countdown.textContent = timer;
        timer--;
 
        if (timer < 0) {
            score = 0;
            showScoreContainer(score);
            clearInterval(timeInterval);
        }
    }, 1000);
}

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

function start() {
    qListCurrent = qList
    hideEle(startContainer);
    showEle(questionCard);
    startTimer();
    nextQuestion();
}

function reset() {
    timer = 60;
    qIndex = 0;
    countdown.textContent = timer;
    qListCurrent = [];
    qCard = {};
    initials.value = "";
    
    clearList(highscoresList);
    hideEle(highscoresContainer);
    hideEle(finishedContainer);
    hideEle(emptyHighscores);
    showEle(header);
    showEle(startContainer);
}


startButton.addEventListener("click", start);
tryAgainButton.addEventListener("click", reset);
clearButton.addEventListener("click", clearHighscores);
viewHighscore.addEventListener("click", showHighscores);
submitButton.addEventListener("click", function() {
    storeHighscores(event);
})
