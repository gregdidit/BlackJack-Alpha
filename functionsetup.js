let resultFromInput = 500000;
let InputValue = 100000000;
let InputValueTwo = 10;
let cardIndex = 0;
let cl = console.log;
let playerHand = [];
let playerTotal = 0;
let playerState;
let shuffledCards = [];
let myDeck = new deck();
let reply = "";
let buttonTrigger = document.querySelector(buttonTrigger);

function caluationFunction(InputValue, InputValueTwo) {
    let resultFromInput = InputValue + InputValueTwo;
    return resultFromInput;
}



// console.log(caluationFunction(1, 2));



function card(value, name, suit) {
    this.value = value;
    this.name = name;
    this.suit = suit;
}


function deck() {
    this.names = ['Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'];
    this.suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];
    let cards = [];

    for (let s = 0; s < this.suits.length; s++) {
        for (let n = 0; n < this.names.length; n++) {
            cards.push(new card(n + 1, this.names[n], this.suits[s]));
        }
    }

    return cards;
}

function shuffle() {
    shuffledCards = myDeck.map(value => ({
            value,
            sort: Math.random()
        }))
        .sort((a, b) => a.sort - b.sort)
        .map(({
            value
        }) => value)
    return shuffledCards;
}


function randomNum() {
    cardIndex = (Math.floor(Math.random() * 51));
}


function displayCard() {
    playerHand[0] = shuffledCards[0];
    playerHand[1] = shuffledCards[1];
    cl(`Your cards are: " + "\n" +
    ${playerHand[0].name} + " of " + ${playerHand[0].suit} + " and " + ${playerHand[1].name} + " of " + ${playerHand[1].suit} +
      "current total: " + (playerHand[0].value + playerHand[1].value)`);
}

function currentHand() {
    playerTotal = 0;
    for (let i = 0; i < playerHand.length; i++) {
        playerTotal = playerTotal += playerHand[i].value;
    }
}

function total() {
    playerTotal = playerTotal + playerHand.value;
}

function addCard() {
    cardIndex = playerHand.length;
    playerHand[cardIndex] = shuffledCards[cardIndex + 1];
    cl("Picked Up: " + playerHand[cardIndex].name + " of " + playerHand[cardIndex].suit)

    // cl("current total: " + playerTotal)
    if (playerTotal > 21) {
        cl("You've gone bust!");
    }
}

function playOn() {
    let reply = prompt("Hit Me or Stand");
    if (reply === "Hit Me" || "hit me" || "Hit" || "hit") {
        addCard();
    } else {
        cl("goodbye");
        return reply;
    }
}

function clickingMe() {

}



shuffle();
displayCard();
// currentHand();
// cl(playerHand)
playerHand.forEach(total);
cl(playerTotal)
addCard();
// cl("card index is: " + cardIndex);
// cl("player hand legnth is: " + playerHand.length);