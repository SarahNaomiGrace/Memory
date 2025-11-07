// >> Hilfsfunktionen:
function shuffle(array){
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
  // Mischt ein Array per Fisher-Yates-Algorithmus. 
  // Dadurch Gleichverteiltes, faires Mischen ohne Bias.

function formatTime(sec){
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}
  // Formatiert Sekunden in MM:SS Format.
  // Macht es lesbar im UI, führende Nullen durch padStart.



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
  "australianshepherd.jpg",
  "yorkshireterrier.jpg"
].map(name => `images/${name}`);  // Bilddateien eingebunden.

let symbols = [];           // das gemischte 20er-Deck (10 Motive x2)
let firstCard = null;       // erste aufgedeckte Karte im Zug
let secondCard = null;      // zweite aufgedeckte Karte im Zug
let lockBoard = false;      // verhindert weitere Klicks während der Animation
let moves = 0;              // Anzahl der Züge
let matchedPairs = 0;       // Anzahl der gefundenen Paare
let seconds = 0;            // vergangene Zeit in Sekunden
let timerId = null;         // ID des Timer-Intervals



// >> DOM - Referenzen:
const boardEl    = document.getElementById("board");
const movesEl    = document.getElementById("moves");
const timeEl     = document.getElementById("time");
const restartBtn = document.getElementById("restart");
  // greift auf die UI-Elemente zu ("").
  // wird für Rendering und Interaktionen gebraucht.



// >> Karten erstellen:
function createCard(symbol, index){
  const card = document.createElement("button");  
  card.className = "card";    
  card.type = "button";            
  card.dataset.symbol = symbol;   // Motivname
  card.dataset.index = index;     // Eindeutiger Index im Deck

  const back = document.createElement("div");
  back.className = "card__face card__face--back";

  const front = document.createElement("div");
  front.className = "card__face card__face--front";

  const img = document.createElement("img");
  img.className = "symbol-image";
  img.src = symbol;
  img.alt = "Karte";
  front.appendChild(img);
    // Rückseite einheitlich, Vorderseite mit Bild. 
    // CSS-Klassen sorgen via 3D-Flip dafür, dass die Karten umklappen.

  card.append(back, front);
  card.addEventListener("click", onCardClick);
  return card;
    // Event-Handler pro Karte für Klicks.
}



// >> Board-Aufbau:
function buildBoard(){
  boardEl.innerHTML = "";
  symbols = shuffle([...symbolsBase, ...symbolsBase]);
  symbols.forEach((sym, i) => boardEl.appendChild(createCard(sym, i)));
}
  // Hier wird das Board geleert, Motive dupliziert, mischt sie und erzeugt 
  // DOM-Karten,die dem Board wieder hinzugefügt werden.

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
    return; 
  }

  secondCard = card;
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
    lockBoard = true;
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

// ---------- Neustart ----------
function restart(){
  moves = 0;
  matchedPairs = 0;
  movesEl.textContent = "0";
  buildBoard();
  startTimer();
}
restartBtn.addEventListener("click", restart);

// ---------- Start ----------
restart();