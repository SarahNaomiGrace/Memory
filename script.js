// >> Hilfsfunktionen:
function shuffle(array){
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
// Mischt ein Array per Fisher-Yates-Algorithmus.

function formatTime(sec){
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}
// Formatiert Sekunden in MM:SS.

// >> Spielzustand:
const symbolsBase = [
  "malteser.jpg",
  "dackel.jpg",
  "dalmatiner.jpg",
  "chihuahua.jpg",
  "schaeferhund.jpg",
  "bolonka.jpg",
  "labrador.jpg",
  "pudel.jpg",
  "australianshepherd.jpg",   // <- korrigiert
  "yorkshireterrier.jpg"
].map(name => `images/${name}`);

let symbols = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let matchedPairs = 0;
let seconds = 0;
let timerId = null;

// >> DOM - Referenzen:
const boardEl    = document.getElementById("board");
const movesEl    = document.getElementById("moves");
const timeEl     = document.getElementById("time");
const restartBtn = document.getElementById("restart");

// >> Karten erstellen:
function createCard(symbol, index){
  const card = document.createElement("button");
  card.className = "card";
  card.type = "button";
  card.dataset.symbol = symbol;
  card.dataset.index = index;

  const back = document.createElement("div");
  back.className = "card__face card__face--back";

  const front = document.createElement("div");
  front.className = "card__face card__face--front";

  const img = document.createElement("img");
  img.className = "symbol-image";
  img.src = symbol;   // enthält bereits "images/.."
  img.alt = "Karte";
  front.appendChild(img);

  card.append(back, front);
  card.addEventListener("click", onCardClick);
  return card;
}

// >> Board aufbauen:
function buildBoard(){
  boardEl.innerHTML = "";
  symbols = shuffle([...symbolsBase, ...symbolsBase]);
  symbols.forEach((sym, i) => boardEl.appendChild(createCard(sym, i)));
}

// ---------- Timer ----------
function startTimer(){
  stopTimer();
  seconds = 0;
  timeEl.textContent = "00:00";
  timerId = setInterval(() => {
    seconds++;
    timeEl.textContent = formatTime(seconds);
  }, 1000);
}
function stopTimer(){
  if(timerId) clearInterval(timerId);
  timerId = null;
}

// ---------- Kartenklick ----------
function onCardClick(e){
  const card = e.currentTarget;
  if(lockBoard) return;
  if(card.classList.contains("is-flipped")) return;

  card.classList.add("is-flipped");

  if (!firstCard){
    firstCard = card;
    return;
  }
  if(firstCard.dataset.index === card.dataset.index){
    return; // gleiche Karte erneut angeklickt
  }

  secondCard = card;
  lockBoard = true;            // sofort sperren
  moves++;
  movesEl.textContent = moves;
  checkMatch();
}

function checkMatch(){
  const match = firstCard.dataset.symbol === secondCard.dataset.symbol;

  if(match){
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    firstCard.disabled = true;
    secondCard.disabled = true;
    matchedPairs++;
    resetTurn();
    if(matchedPairs === symbolsBase.length){
      stopTimer();
      setTimeout(() => {
        alert(`Geschafft! 🎉\nZüge: ${moves}\nZeit: ${formatTime(seconds)}`);
      }, 300);
    }
  } else {
    setTimeout(() => {
      firstCard.classList.remove("is-flipped");
      secondCard.classList.remove("is-flipped");
      resetTurn();
    }, 800);
  }
}

function resetTurn(){
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// ---------- Images vorladen ----------
function preloadImages(paths){
  paths.forEach(p => { const i = new Image(); i.src = p; });
}

// ---------- Neustart ----------
function restart(){
  moves = 0;
  matchedPairs = 0;
  movesEl.textContent = "0";
  preloadImages(symbolsBase);
  buildBoard();
  startTimer();
}
restartBtn.addEventListener("click", restart);

// ---------- Start ----------
restart();
