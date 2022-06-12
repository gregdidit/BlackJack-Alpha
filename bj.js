//Prototype BlackJack Game
const cl = console.log;
let cardIndex = 0;
let playerHand = [];
let playerTotal = 0;
let dealerHand = [];
let dealerTotal = 0;
let shuffledCards = [];
let cardId = 0;
let playerTurn = true;
let playerHold = false;
const rawDeck = new deck();

const hitBtn = document.getElementById('hit');
const standBtn = document.getElementById('stand');
const refreshBtn = document.getElementById('playagainbtn-top');

const playerScoreOutput = document.getElementById('player-score');
const playerOutcomeOutput = document.getElementById('player-outcome');
const playerResultOutput = document.getElementById('player-result');


const cardHtml = [{
        suit: "Heart",
        html: `<i class="bi bi-suit-heart-fill"></i>`,
        color: "red"
    },
    {
        suit: "Diamond",
        html: `<i class="bi bi-suit-diamond-fill"></i>`,
        color: "red"
    },
    {
        suit: "Spade",
        html: `<i class="bi bi-suit-spade-fill"></i>`,
        color: "black"
    },
    {
        suit: "Club",
        html: `<i class="bi bi-suit-club-fill"></i>`,
        color: "black"
    },
]

const cardTopIcon = document.getElementById('card-icon-top');
const cardFrontValue = document.getElementById('card-value');
const cardBottomIcon = document.getElementById('card-icon-bottom');

const playerCard = document.getElementsByClassName('playerCard');
const dealerCard = document.getElementsByClassName('dealerCard');




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
    playerTotal = 0;
    playerHand[0] = shuffledCards[0];
    playerHand[1] = shuffledCards[1];
    playerTotal = playerHand[0].value + playerHand[1].value;
    cl(`Drawn cards are: ${playerHand[0].name} of ${playerHand[0].suit} and ${playerHand[1].name} of ${playerHand[1].suit}
current total: ` + (playerHand[0].value + playerHand[1].value));
    if (playerHand[0].value + playerHand[1].value === 21) {
        playerResultOutput.innerText = "21!!! Congratualtions you have won!";
        cl('21!!! Congratualtions you have won!')
        playerStop()
    }
    if (playerHand[0].value + playerHand[1].value > 21) {
        playerResultOutput.innerText = "You've gone bust, play again!";
        cl(`You've gone bust, play again!`)
        playerStop()
    }
}

function cardFrontCreation(suit = 1, name = 'Queen') {
    if (name === 'King') {
        name = 'K'
    }
    if (name === 'Queen') {
        name = 'Q'
    }
    if (name === 'Jack') {
        name = 'J'
    }
    cardFrontValue.innerHTML = name;
    cardTopIcon.innerHTML = cardHtml[suit].html;
    cardBottomIcon.innerHTML = cardHtml[suit].html;
    cardTopIcon.style.color = cardHtml[suit].color;
    cardBottomIcon.style.color = cardHtml[suit].color;
}


function cardValueCheck() {
    if (playerTurn === true) {
        if (playerTotal > 21) {
            playerStop()
            playerResultOutput.innerText = "You've gone bust, play again!";
            cl(`You've gone bust, play again!`);
        }
        if (playerTotal === 21) {
            cl('21!!! Congratualtions you have won!');
            playerStop()
        }
    } else if (playerTurn === false) {
        if (dealerTotal > 21) {
            cl(`The Dealer has bust gone bust, you win`);
            playerStop()
        }
        if (dealerTotal === 21 || dealerTotal > playerTotal) {
            cl(`The dealer has won, Unlucky!`);
            playerStop()
        }
    }

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
    playerTotal = 0; //on each call of the fuction the score goes to 0
    // dealerTotal = 0; //on each call of the fuction the
    const resultsh = []; //temp empty array for the card text to go in
    if (playerTurn === true) {
        for (i = 0; i < playerHand.length; i++) {
            showCard = ` ${playerHand[i].name} of ${playerHand[i].suit}` //grabs and joins each card name (name, suit)
            playerTotal = playerTotal + playerHand[i].value; //add thep layer total for the current hand
            resultsh.push(showCard); //adds current card on itteration to deck
        }
        playerScoreOutput.innerText = `Current Hand is:${resultsh}`;
        cl(`Current Hand is:${resultsh}`); // trying to display all cards from the array in the console
        cl(`Current total is: ${playerTotal} with ${playerHand.length} cards`);
        cardValueCheck()
    }
    if (playerTurn == false && playerHold === true) {
        for (i = 0; i < dealerHand.length; i++) {
            showCard = `${dealerHand[i].name} of ${dealerHand[i].suit}`
            dealerTotal = dealerTotal + dealerHand[i].value;
            resultsh.push(showCard);
            // cl(`The Dealers total is: ${playerTotal} with ${playerHand.length} cards`);
            // cl(`Current Hand is:${resultsh}`);
            cardValueCheck()
        }
    }
}

function playerStop() {
    playerTurn = false;
    cardIndex = cardIndex + 1;
    hitBtn.disabled = true;
    hitBtn.style.color = 'grey';
    standBtn.disabled = true;
    standBtn.style.color = 'grey';
    refreshBtn.style.visibility = 'visible';
}

function playerStand() {
    playerStop()
}


hitBtn.addEventListener('click', () => {
    addCard()
    displayTotal()
});

standBtn.addEventListener('click', () => {
    playerHold = true;
    playerStop()
    playerOutcomeOutput.innerText = `You have stand with a total of ${playerTotal}`;
    cl(`You have stand with a total of ${playerTotal}`)
    dealerLogic()
})

refreshBtn.addEventListener('click', () => {
    window.location.reload();
})


function dealerLogic() {
    dealerHand[0] = shuffledCards[cardIndex];
    dealerHand[1] = shuffledCards[cardIndex + 1];
    cl('Dealers Turn')
    addCardDealer()
    // displayTotal()
}

function addCardDealer() {
    cardIndex = dealerHand.length;
    cardId = cardId + 1;
    dealerTotal = 0;
    //TODO: Make loop fuction for dealer
    // for (let i = 0; i < dealerHand.length; i++) {
    dealerHand[cardIndex] = shuffledCards[cardId + 2];

    // cl(`Card added: ${dealerHand[i].name} of ${dealerHand[cardIndex].suit}`)
}



shuffle();
firstDraw();
cardFrontCreation()