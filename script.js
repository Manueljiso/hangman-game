const alpha = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
let wordToGuess = "";
let guessedLetters = "";
let fields = "";
let mistakeCount = 0;
let originalWord = "";
let popupMode = "";

const hangmanSection = document.querySelector(".the-hangman");
const hangmanHead = document.querySelector("#head");
const hangmanBody = document.querySelector("#body");
const hangmanLeftArm = document.querySelector("#left-arm");
const hangmanRightArm = document.querySelector("#right-arm");
const hangmanLeftLeg = document.querySelector("#left-leg");
const hangmanRightLeg = document.querySelector("#right-leg");
const wordSection = document.querySelector(".the-word");
const mistakesSection = document.querySelector(".mistakes");
const buttonPanelSection = document.querySelector("#panel-label");
const letterButtonSection = document.querySelector(".letter-buttons");
const multiMode = document.querySelector("#multiplayer-button");
const singleMode = document.querySelector("#singleplayer-button");

const modal = document.getElementById("word-modal");
const exitButton = document.querySelector("#exit");
const popupTitle = document.getElementById("modal-title");
const popupMessage = document.getElementById("modal-message");
const popupInput = document.getElementById("modal-input");
const popupButton = document.getElementById("modal-button");

multiMode.addEventListener("click", () => {
  popupMode = "input";
  popupController();
});
singleMode.addEventListener("click", singlePlayerMode);

exitButton.addEventListener("click", () => {
  popupMode = "invalid";
  buttonController();
})
popupInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    buttonController();
  }
});
popupButton.addEventListener("click", buttonController);

function buttonCheck(event) {
  button = event.target;
  letter = button.textContent;

  if (wordToGuess.includes(letter)) {
    guessedLetters += letter;
    button.disabled = true;
    button.classList.add("correct")
    printBlanks();

    if (wordToGuess === fields) {
      console.log(fields);
      buttonPanelSection.textContent = "";
      letterButtonSection.innerHTML = `<h1>¡Éxito!</h1>`;
    }

  } else {
    mistakeCount += 1;
    button.disabled = true;
    button.classList.add("incorrect")
    hangHim(mistakeCount)
    if (mistakeCount >= 6) {
      buttonPanelSection.textContent = "";
      letterButtonSection.innerHTML = `<h1>La palabra era ${originalWord}</h1>`;
    }
  }
}

function printBlanks() {
  fields = "";
  let theWord = "";
  for (const letter of wordToGuess) {
    if (guessedLetters.includes(letter)) {
      fields += `${letter}`;
    } else {
      fields += `_`;
    }
  }
  for (const letter of fields) {
    theWord += `<span>${letter}</span>`;
  }
  wordSection.innerHTML = theWord;
}

function letterButtonGenerator() {
  let buttons = "";

  for (letter of alpha) {
    buttons += `<button class="dynamic-button">${letter}</button>`;
  }
  
  letterButtonSection.innerHTML = buttons;

  let letterButton = document.querySelectorAll(".dynamic-button");

  for (const button of letterButton) {
    button.addEventListener("click", buttonCheck);
  };
}

function hideHangman() {
  hangmanHead.classList.add("hidden");
  hangmanBody.classList.add("hidden");
  hangmanLeftArm.classList.add("hidden");
  hangmanRightArm.classList.add("hidden");
  hangmanLeftLeg.classList.add("hidden");
  hangmanRightLeg.classList.add("hidden");
}

function hangHim(counter) {
  switch (counter) {
    case 1:
      hangmanHead.classList.remove("hidden");
      break;

    case 2:
      hangmanBody.classList.remove("hidden");
      break;
    
    case 3:
      hangmanLeftArm.classList.remove("hidden");
      break;
    
    case 4:
      hangmanRightArm.classList.remove("hidden");
      break;
    
    case 5:
      hangmanLeftLeg.classList.remove("hidden");
      break;
    
    case 6:
      hangmanRightLeg.classList.remove("hidden");
      break;
  }
}

function resetLayout() {
  buttonPanelSection.textContent = "Presiona un botón";

  guessedLetters = "";
  mistakeCount = 0;
  
  printBlanks();
  hideHangman();
  letterButtonGenerator();
}

async function loadWords() {
  const response = await fetch("words-es.json");
  words = await response.json();
  console.log(words);
}

loadWords();

function validateInput(word) {
  return /^[a-záéíóúüñ]+$/i.test(word);
} 

function normalizeWord(word) {
  let enie = [];
  let normalizedWord = "";

  for (let i = 0; i < word.length; i++) {
    if (word[i] === "Ñ") {
      enie.push(i);
    }
  }

  let wordBuffer = word
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  for (let i = 0; i < wordBuffer.length; i++) {
    if (enie.includes(i)) {
      normalizedWord += "Ñ";
    } else {
      normalizedWord += wordBuffer[i];
    }
  }
  
  return normalizedWord;
}

function multiPlayerMode() {

  originalInput = popupInput.value;
  modal.style.display = "none";

  if (originalInput === null) {
    popupController();
    console.log("Input Cancelled");
  } else {
    if (validateInput(originalInput) === true) {
      originalWord = originalInput.toUpperCase();
      wordToGuess = normalizeWord(originalWord);
      console.log(wordToGuess);
      resetLayout();
    } else {
      popupMode = "invalid";
      popupController();
    }
  }
}

function singlePlayerMode() {
  const randomIndex = Math.floor(Math.random() * words.length);
  
  originalWord = words[randomIndex].toUpperCase();
  
  wordToGuess = normalizeWord(originalWord); 

  console.log(wordToGuess);

  resetLayout();
}

function buttonController() {
  if (popupMode === "input") {
    multiPlayerMode();
  } else if (popupMode === "invalid") {
    modal.style.display = "none";
  }
}

function popupController() {

  if (popupMode === "input") {
    popupTitle.textContent = "¿Qué palabra hay que adivinar?:";
    popupMessage.style.display = "none";
    popupInput.style.display = "block";
    popupInput.value = "";
    modal.style.display = "block";
    popupInput.focus();
  } else if (popupMode === "invalid") {
    popupTitle.textContent = "¡Mucho ojo, cuate!";
    popupMessage.style.display = "block";
    popupMessage.textContent = `\"${originalInput}\" no es una palabra válida`;
    popupInput.style.display = "none";
    modal.style.display = "block";
    setTimeout(() => {
      popupButton.focus();
    }, 0);
  }
}

hideHangman();
resetLayout();