//Prototype BlackJack Game
const cl = console.log;
let cardIndex = 0;
let playerHand = [];
let playerTotal = 0;
let playerFinalTotal = 0;
let dealerHand = [];
let dealerTotal = 0;
let shuffledCards = [];
let cardId = 0;
let cardUiPosition = 0;
let playerTurn = true;
let playerHold = false;
const rawDeck = new deck();

const hitBtn = document.getElementById('hit');
const standBtn = document.getElementById('stand');
const refreshBtn = document.getElementById('playagainbtn-top');
const refreshBtnbtm = document.getElementById('playagain-bottom');

const playerScoreOutput = document.getElementById('player-score');
const playerOutcomeOutput = document.getElementById('player-outcome');
const playerResultOutput = document.getElementById('player-result');

const dealerScoreOutput = document.getElementById('dealer-score');
const dealerOutcomeOutput = document.getElementById('dealer-outcome');
const dealerResultOutput = document.getElementById('dealer-result');

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

const cardTopIcon = document.getElementsByClassName('card-top');
const cardFrontValue = document.getElementsByClassName('card-value');
const cardBottomIcon = document.getElementsByClassName('card-bottom');

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

    for (var i = 0; i < playerHand.length; i++) {
        cardUiPosition = i;
        playerCard[i] = cardFrontCreation(playerHand[i].suit, playerHand[i].name);
    }
    playerOutcomeOutput.innerText = `You have a total of ${playerTotal}`;
    playerScoreOutput.innerText = `First drawn is: ${playerHand[0].name} of ${playerHand[0].suit} and ${playerHand[1].name} of ${playerHand[1].suit}`
    cl(`Drawn cards are: ${playerHand[0].name} of ${playerHand[0].suit} and ${playerHand[1].name} of ${playerHand[1].suit}
current total: ` + (playerHand[0].value + playerHand[1].value));
    if (playerHand[0].value + playerHand[1].value === 21) {
        playerResultOutput.innerText = "21!!! Congratualtions you have won!";
        cl('21!!! Congratualtions you have won!');
        refreshBtn.style.visibility = 'visible';
        playerStop()
    }
    if (playerHand[0].value + playerHand[1].value > 21) {
        playerResultOutput.innerText = "You've gone bust, play again!";
        refreshBtn.style.visibility = 'visible';
        cl(`You've gone bust, play again!`);
        playerStop()
    }
}

function cardFrontCreation(suit, value) {
    switch (suit) {
        case 'Hearts':
            suit = 0
            break
        case 'Diamonds':
            suit = 1
            break
        case 'Spades':
            suit = 2
            break
        case 'Clubs':
            suit = 3
            break
        default:
            suit = suit;
            break
    }

    switch (value) {
        case 'King':
            value = 'K'
            break
        case 'Queen':
            value = 'Q'
            break
        case 'Jack':
            value = 'J'
            break
        case 'Ace':
            value = 'A'
            break
        default:
            value = value;
            break
    }
    cardTopIcon[cardUiPosition].innerHTML = cardHtml[suit].html;
    cardFrontValue[cardUiPosition].innerHTML = value;
    cardBottomIcon[cardUiPosition].innerHTML = cardHtml[suit].html;
    cardTopIcon[cardUiPosition].style.color = cardHtml[suit].color;
    cardBottomIcon[cardUiPosition].style.color = cardHtml[suit].color;
}


function cardValueCheck() {
    if (playerTurn === true) {
        if (playerTotal > 21) {
            playerStop()
            playerOutcomeOutput.innerText = `You have a total of ${playerTotal}`;
            playerResultOutput.innerText = "You've gone bust, play again!";
            refreshBtn.style.visibility = 'visible';
            // cl(`You've gone bust, play again!`);
        } else if (playerTotal === 21) {
            // cl('21!!! Congratualtions you have won!');
            playerOutcomeOutput.innerText = `Total: ${playerTotal}`;
            playerResultOutput.innerText = '21!!! Congratualtions you have won!';
            refreshBtn.style.visibility = 'visible';
            playerStop()
        }
    }
    if (playerTurn === false && playerHold === true) {
        //TODO: Sort the Comparison on the dealers score and convert to a swtich statment
        if (dealerTotal > 21) {
            // cl(`The Dealer has gone bust, you win`);
            dealerResultOutput.innerText = `The Dealer has gone bust, you win`;
            playerStop();
        } else if (dealerTotal === 21) {
            // cl(`The dealer has won with 21, Unlucky!`);
            dealerResultOutput.innerText = `The dealer has won with 21, Unlucky!`;
            playerStop()
        } else if (dealerTotal > playerFinalTotal && dealerTotal < 21) {
            // cl(`The dealer wins but beating your score, Unlucky!`);
            dealerResultOutput.innerText = `The dealer wins by beating your score, Unlucky!`;
            playerStop()
        } else {
            setTimeout(addCardDealer, 2000);
        }
    }
}

function addCard() {
    cardIndex = playerHand.length;
    for (let i = 0; i < playerHand.length; i++) {
        playerHand[cardIndex] = shuffledCards[cardIndex];
        // cardId = cardIndex;
    }
    cardUiPosition = cardIndex;
    playerCard[cardIndex].style.visibility = 'visible';
    playerCard[cardIndex] = cardFrontCreation(playerHand[cardIndex].suit, playerHand[cardIndex].name);
    playerOutcomeOutput.innerText = `You have a total of ${playerTotal}`;
    cl(`Card added: ${playerHand[cardIndex].name} of ${playerHand[cardIndex].suit}`);
}

function displayTotal() {
    const resultsh = []; //temp empty array for the card text to go in
    playerTotal = 0; //on each call of the fuction the score goes to 0
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
    if (playerTurn === false && playerHold === true) {
        dealerTotal = 0; //on each call of the fuction the
        for (i = 0; i < dealerHand.length; i++) {
            showCard = ` ${dealerHand[i].name} of ${dealerHand[i].suit}`
            dealerTotal = dealerTotal + dealerHand[i].value;
            resultsh.push(showCard);
        }
        dealerScoreOutput.innerText = `Dealers Hand is: ${resultsh}`;
        dealerOutcomeOutput.innerText = `Dealers total is: ${dealerTotal}`;
        cardValueCheck()
    }
}

function playerStop() {
    playerTurn = false;
    cardIndex = cardIndex + 1;
    hitBtn.disabled = true;
    hitBtn.style.color = 'grey';
    standBtn.disabled = true;
    standBtn.style.color = 'grey';
}

hitBtn.addEventListener('click', () => {
    addCard()
    displayTotal()
});

standBtn.addEventListener('click', () => {
    playerFinalTotal = playerTotal;
    playerHold = true;
    refreshBtnbtm.style.visibility = 'visible';
    playerStop()
    playerOutcomeOutput.innerText = `You have stand with a total of ${playerFinalTotal}`;
    // cl(`You have stand with a total of ${playerFinalTotal}`);
    dealerLogic();
})

refreshBtn.addEventListener('click', () => {
    window.location.reload();
})
refreshBtnbtm.addEventListener('click', () => {
    window.location.reload();
})

function dealerLogic() {
    cl('Dealers Turn');
    cardId = playerHand.length;
    dealerHand[0] = shuffledCards[cardId];
    dealerHand[1] = shuffledCards[cardId + 1];
    cardUiPosition = dealerCard.length;
    dealerCard[0].style.visibility = 'visible';
    dealerCard[1].style.visibility = 'visible';
    dealerCard[0] = cardFrontCreation(dealerHand[0].suit, dealerHand[0].name);
    cardUiPosition++;
    dealerCard[1] = cardFrontCreation(dealerHand[1].suit, dealerHand[1].name);
    cardUiPosition++;
    cardId++
    displayTotal()
}

function addCardDealer() {
    i = dealerHand.length;
    dealerHand[i] = shuffledCards[cardId + 1];
    dealerCard[i].style.visibility = 'visible';
    dealerCard[i] = cardFrontCreation(dealerHand[i].suit, dealerHand[i].name);
    cardUiPosition++;
    cardId++
    displayTotal()
}

shuffle();
firstDraw();