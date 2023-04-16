var questionheader = document.querySelector("#questionHeader");
var optionsList = document.querySelector("#Options");
var result = document.querySelector("#result");
var win = document.querySelector(".win");
var lose = document.querySelector(".lose");
// var timerElement = document.querySelector(".timer-count");
var timerElement = document.querySelector("#counter");
var startButton = document.querySelector("#btnstart");
var resultDiv = document.querySelector("#result");

var chosenWord = "";
var numBlanks = 0;
var winCounter = 0;
var loseCounter = 0;
var isWin = false;
var timer;
var timerCount;
var selectedQuestion;
var questions;

function fillQuestions() {
  questions = [
    {
      question: "What is your Name?",
      options: ["Nidhi", "Satyam", "Anju", "Naresh"],
      correctAnswer: "Nidhi",
    },
    {
      question: "What is your Age?",
      options: ["13", "45", "36", "90"],
      correctAnswer: "36",
    },
    {
      question: "What is name of your best friend?",
      options: ["Fatima", "Renju", "Alex", "Jim"],
      correctAnswer: "Renju",
    },
    {
      question: "Which state you were born?",
      options: ["Calcutta", "Hyderabad", "Mumbai", "Gujrat"],
      correctAnswer: "Gujrat",
    },
  ];
}

function renderRandomQuestions() {
  //clear the ol elements
  optionsList.innerHTML = "";
  if (questions == null || questions.length <= 0) {
    timerCount = 0;
    loseGame();
    selectedQuestion = null;
    return;
  }

  // If the count is zero, exit function
  if (timerCount <= 0) {
    return;
  }

  //TODO: if the question is already asked then do not select that question again
  console.log("Before: " + questions);
  //get the random question from the list;
  var index = Math.floor(Math.random() * questions.length);
  console.log(index);
  selectedQuestion = questions[index];
  console.log(selectedQuestion);

  console.log(selectedQuestion.question);
  //show the question in UI
  questionheader.textContent = selectedQuestion.question;
  console.log(selectedQuestion.options);
  for (var item = 0; item < selectedQuestion.options.length; item++) {
    let option = document.createElement("li");
    option.className = "listItem";
    option.innerText = selectedQuestion.options[item];
    option.addEventListener("click", itemSelected);
    optionsList.appendChild(option);
  }

  questions.splice(index, 1);
  console.log("After removed: " + questions);
}

function itemSelected(item) {
  var a = item.target.innerText;
  console.log(a);

  if (a === selectedQuestion.correctAnswer) {
    winGame();
  } else {
    loseGame();
  }
}

// The winGame function is called when the win condition is met
function winGame() {
  resultDiv.style.visibility = "visible";
  result.textContent = "Correct Answer.";
  winCounter++;
  startButton.disabled = false;
  setWins();
  //Reload the next question if timer count is running.
  if (timerCount > 0) renderRandomQuestions();
}

// The loseGame function is called when timer reaches 0
function loseGame() {
  resultDiv.style.visibility = "visible";
  if (timerCount <= 0) {
    result.textContent = "GAME OVER";
    optionsList.innerHTML = "";
    questionheader.textContent = "";
    startButton.disabled = false;
  } else {
    result.textContent = "wrong answer";
    //reduce the timercount by 10
    loseCounter++;
    startButton.disabled = false;
    setLosses();
    if (timerCount > 0) {
      timerCount -= 10;
      if (timerCount <= 0) {
        var mintimer = Math.min(0, timerCount);
        if (mintimer < 0) {
          timerCount = 0;
        }
      } else if (timerCount > 0) {
        renderRandomQuestions();
      }
    } else {
      timerCount = 0;
    }
  }
}

function setWins() {
  win.textContent = winCounter;
  localStorage.setItem("winCount", winCounter);
}

// Updates lose count on screen and sets lose count to client storage
function setLosses() {
  lose.textContent = loseCounter;
  localStorage.setItem("loseCount", loseCounter);
}

function startGame() {
  resultDiv.style.visibility = "hidden";
  isWin = false;
  timerCount = 60;
  if (questions == null || questions.length <= 0) fillQuestions();
  // Prevents start button from being clicked when round is in progress
  startButton.disabled = true;
  renderRandomQuestions();
  startTimer();
}

function startTimer() {
  timer = setInterval(countTimer, 1000);
}

function countTimer() {
  if (timerCount == 0) {
    clearInterval(timer);
    loseGame();
    return;
  }
  //reduce the counter
  timerCount--;
  //display counter in UI
  timerElement.textContent = timerCount;

  //If the coutner reaches 0 then stop the timer
  //TODO: add the check if the questions are pending to be answered.
  //if yes then loose game.
  if (timerCount <= 0) {
    clearInterval(timer);
    loseGame();
  }
}

// The init function is called when the page loads
function init() {
  getWins();
  getlosses();
}

// These functions are used by init
function getWins() {
  // Get stored value from client storage, if it exists
  var storedWins = localStorage.getItem("winCount");
  // If stored value doesn't exist, set counter to 0
  if (storedWins === null) {
    winCounter = 0;
  } else {
    // If a value is retrieved from client storage set the winCounter to that value
    winCounter = storedWins;
  }
  //Render win count to page
  win.textContent = winCounter;
}

function getlosses() {
  var storedLosses = localStorage.getItem("loseCount");
  if (storedLosses === null) {
    loseCounter = 0;
  } else {
    loseCounter = storedLosses;
  }
  lose.textContent = loseCounter;
}

init();

// Attach event listener to start button to call startGame function on click
startButton.addEventListener("click", startGame);
