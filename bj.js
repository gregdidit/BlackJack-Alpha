//Prototype BlackJack Game
let cardIndex = 0;
let cl = console.log;
let playerHand = [];
let playerTotal = 0;
let shuffledCards = [];
let cardId = 0;
let rawDeck = new deck();

let clicked = document.getElementById('buttonTrigger');


function randomNum() {
    cardIndex = (Math.floor(Math.random() * 51));
}

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
    shuffledCards = rawDeck.map(value => ({
            value,
            sort: Math.random()
        }))
        .sort((a, b) => a.sort - b.sort)
        .map(({
            value
        }) => value)
    return shuffledCards;
}

function firstDraw() {
    playerHand[0] = shuffledCards[0];
    playerHand[1] = shuffledCards[1];
    cl(`Drawn cards are: ${playerHand[0].name} of ${playerHand[0].suit} and ${playerHand[1].name} of ${playerHand[1].suit}
current total: ` + (playerHand[0].value + playerHand[1].value));
}

function addCard() {
    cardIndex = playerHand.length;
    for (let i = 0; i < playerHand.length; i++) {
        playerHand[cardIndex] = shuffledCards[cardIndex];
        cardId = cardIndex;
    }
    cl(`Card added: ${playerHand[cardIndex].name} of ${playerHand[cardIndex].suit}`)
}

function displayTotal() {
    playerTotal = 0; //on each call of the fuction the score goes to 1
    const resultsh = []; //temp empty array for the card text to go in
    for (i = 0; i < playerHand.length; i++) {
        showCard = ` ${playerHand[i].name} of ${playerHand[i].suit}` //grabs and joins each card name (name, suit)
        playerTotal = playerTotal + playerHand[i].value; //add thep layer total for the current hand
        resultsh.push(showCard); //adds current card on itteration to deck
    }
    cl(`Current total is: ${playerTotal} with ${playerHand.length} cards`);
    cl(`Drawn cards are:${resultsh}`); // trying to display all cards from the array in the console
    if (playerTotal > 21) {
        cl(`you've gone bust`);
    }
}

buttonTrigger.addEventListener('click', () => {
    addCard()
    displayTotal()
});

shuffle();
firstDraw();