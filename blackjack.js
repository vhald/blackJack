let blackjackGame = {
  you: {
    scoreSpan: "#Player-Result",
    div: "#Player-Box",
    score: 0,
  },
  dealer: {
    scoreSpan: "#Dealer-Result",
    div: "#Dealer-box",
    score: 0,
  },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"],
  cardMap: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    J: 10,
    Q: 10,
    K: 10,
    A: [1, 11],
  },
  suites: ["♠", "♦", "♣", "♥"],
  wins: 0,
  losses: 0,
  draws: 0,
  isStand: false,
  turnsOver: false,
};

// var x = prompt("enter your name")
// document.getElementById("player").innerHTML = x;




const YOU = blackjackGame["you"];
const DEALER = blackjackGame["dealer"];

//querySelector() method used to return the first element that matches specified CSS selector(s) in the document
document.querySelector("#hitButton").addEventListener("click", blackjackHit);

// document addEventListner() attaches an event handler to the document
document.querySelector("#standButton").addEventListener("click", dealerLogic);


document.querySelector("#dealButton").addEventListener("click", blackjackDeal);


function blackjackHit() {
  if (blackjackGame["isStand"] === false) {
    let card = randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
  }
}

// to generate a random cards
function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame["cards"][randomIndex];
}

//function to display card on webpage
function showCard(card, activePlayer) {
  if (activePlayer["score"] <= 21) {
    let cardImage = document.createElement("div");
    let randomIndexSuit = Math.floor(Math.random() * 4);
    let singleSuit = blackjackGame["suites"][randomIndexSuit];
    cardImage.className = "card";
    let objkeys = Object.keys(blackjackGame["cardMap"]);
    for (let i = 0; i < objkeys.length; i++) {
      if (objkeys[i] == card) {
        cardImage.innerHTML =
          card + `<div id=suites style="color:black"> ${singleSuit}</div>`; //card and suit
      }
    }

    document.querySelector(activePlayer["div"]).append(cardImage);
  }
}


// function to start next set of the game (resets everthing except points)
function blackjackDeal() {
  if (blackjackGame["turnsOver"] === true) {
    blackjackGame["isStand"] = false;

    let yourImages = document
      .querySelector("#Player-Box")
      .querySelectorAll("div");
    let dealerImages = document
      .querySelector("#Dealer-box")
      .querySelectorAll("div");

    for (var i = 0; i < yourImages.length; i++) {
      yourImages[i].remove();
    }

    for (var i = 0; i < dealerImages.length; i++) {
      dealerImages[i].remove();
    }

    YOU["score"] = 0;
    DEALER["score"] = 0;



    blackjackGame["turnsOver"] = false;
  }
}

// function to add the score of cards displayed.
// If adding 11 keeps me below 21 then add 11. Otherwise, add 1.
function updateScore(card, activePlayer) {
  if (card === "A") {
    if (activePlayer["score"] + blackjackGame["cardMap"][card][1] <= 21) {
      activePlayer["score"] += blackjackGame["cardMap"][card][1];
    } else {
      activePlayer["score"] += blackjackGame["cardMap"][card][0];
    }
  } else {
    activePlayer["score"] += blackjackGame["cardMap"][card];
  }
}

// function to display the score
function showScore(activePlayer) {
  if (activePlayer["score"] > 21) {
    document.querySelector(activePlayer["scoreSpan"]).textContent = "Ur deck Busts out..!";
    // document.querySelector(activePlayer["scoreSpan"]).style.color = "beige";
  } else {
    document.querySelector(activePlayer["scoreSpan"]).textContent = activePlayer["score"];
  }
}

// function for setting the timer of dealer game
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// function for the dealer game
async function dealerLogic() {
  blackjackGame["isStand"] = true;

  while (DEALER["score"] < 16 && blackjackGame["isStand"] === true) {
    let card = randomCard();
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    // BOT LOGIC: Automate such that it shows cards untill score > 15
    await sleep(1000); //1 second
  }
  blackjackGame["turnsOver"] = true;
  showResult(computeWinner());
}


// compute winner
// Update wins, losses, and draws
function computeWinner() {
  // display points after each game
  let winner;

  if (YOU["score"] <= 21) {
    if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
      blackjackGame["wins"]++;
      winner = YOU;
    } else if (YOU["score"] < DEALER["score"]) {
      blackjackGame["losses"]++;
      winner = DEALER;
    } else if (YOU["score"] === DEALER["score"]) {
      blackjackGame["draws"]++;
    }
  } else if (YOU["score"] > 21 && DEALER["score"] <= 21) {
    blackjackGame["losses"]++;
    winner = DEALER;
  } else if (YOU["score"] > 21 && DEALER["score"] > 21) {
    blackjackGame["draws"]++;
  }

  return winner;
}


// taking winner from above fn, passing to below fn as arguement to declare winner
function showResult(winner) {
  let message;

  if (blackjackGame["turnsOver"] === true) {
    if (winner === YOU) {
      document.querySelector("#wins").textContent = blackjackGame["wins"];
      message = "You won..!";
    } else if (winner === DEALER) {
      document.querySelector("#losses").textContent = blackjackGame["losses"];
      message = "You lost..!";

    } else {
      document.querySelector("#draws").textContent = blackjackGame["draws"];
      message = "Its a draw..!";
    }
    document.querySelector("#result").textContent = message;
  }
}