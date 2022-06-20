// These varibles are used for the information gathering from functions for other functions to use.
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
let stopDealer; // This was for clearing the settimeout fuction for the dealer once a new game starts.
const rawDeck = new deck();

//These next varaibles are used to capture events from the front-end of the game for interactivity from the player
const hitBtn = document.getElementById('hit');
const standBtn = document.getElementById('stand');
const refreshBtn = document.getElementById('playagainbtn-top');

const playerScoreOutput = document.getElementById('player-score');
const playerOutcomeOutput = document.getElementById('player-outcome');
const playerResultOutput = document.getElementById('player-result');

const dealerScoreOutput = document.getElementById('dealer-score');
const dealerOutcomeOutput = document.getElementById('dealer-outcome');
const dealerResultOutput = document.getElementById('dealer-result');

const showRules = document.getElementById('show-rules');
const exitRules = document.getElementById('exit-rules');

const modal = document.getElementById('modal');

//These next set of variables are used for the creation of the cards placing elements in each section
const cardTopIcon = document.getElementsByClassName('card-top');
const cardFrontValue = document.getElementsByClassName('card-value');
const cardBottomIcon = document.getElementsByClassName('card-bottom');

const playerCard = document.getElementsByClassName('playerCard');
const dealerCard = document.getElementsByClassName('dealerCard');

const cardFrontUI = document.querySelectorAll('.cardUI');

//Objects lists for the icons + colours used on the front of the cards
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

//Basic random number fuction for the inital shuffle of cards
function randomNum() {
    cardIndex = (Math.floor(Math.random() * 51));
}

//Callback fuction for creating each card from the creation function
function card(value, name, suit) {
    this.value = value;
    this.name = name;
    this.suit = suit;
}

//This function is used for the initial creation of pack of cards
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

//This functions shuffles the cards from the raw made by the previous fuction  and puts them to a new array "shuffled deck"
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


// This function is for the first two drawn cards to the player hands from the shuffled deck which is automatic
function firstDraw() {
    playerHand[0] = shuffledCards[0];
    playerHand[1] = shuffledCards[1];
    playerTotal = playerHand[0].value + playerHand[1].value;

    for (var i = 0; i < playerHand.length; i++) {
        cardUiPosition = i;
        playerCard[i] = cardFrontCreation(playerHand[i].suit, playerHand[i].name);
    }
    playerOutcomeOutput.innerText = `You have a total of ${playerTotal}`;
    playerScoreOutput.innerText = `First drawn is: ${playerHand[0].name} of ${playerHand[0].suit} and ${playerHand[1].name} of ${playerHand[1].suit}`
    if (playerHand[0].value + playerHand[1].value === 21) {
        playerResultOutput.innerText = "21!!! Congratualtions you have won!";
        refreshBtn.style.visibility = 'visible';
        playerStop();
    }
    if (playerHand[0].value + playerHand[1].value > 21) {
        playerResultOutput.innerText = "You've gone bust, play again!";
        refreshBtn.style.visibility = 'visible';
        playerStop();
    }
}

//This function is called when the cards are being distributed to the UI to give the correct value to be shown on the cards face 
function cardFrontCreation(suit, value) {
    switch (suit) {
        case 'Hearts':
            suit = 0;
            break;
        case 'Diamonds':
            suit = 1;
            break;
        case 'Spades':
            suit = 2;
            break;
        case 'Clubs':
            suit = 3;
            break;
        default:
            suit = suit;
            break;
    }

    switch (value) {
        case 'King':
            value = 'K';
            break;
        case 'Queen':
            value = 'Q';
            break;
        case 'Jack':
            value = 'J';
            break;
        case 'Ace':
            value = 'A';
            break;
        default:
            value = value;
            break;
    }
    cardTopIcon[cardUiPosition].innerHTML = cardHtml[suit].html;
    cardFrontValue[cardUiPosition].innerHTML = value;
    cardBottomIcon[cardUiPosition].innerHTML = cardHtml[suit].html;
    cardTopIcon[cardUiPosition].style.color = cardHtml[suit].color;
    cardBottomIcon[cardUiPosition].style.color = cardHtml[suit].color;
}


//This fuction checks after each drawn on both player and dealer repective to thier turn to seen if there is a win/lose condition or it carries on drawing cards
function cardValueCheck() {
    if (playerTurn === true) {
        if (playerTotal > 21) {
            playerStop();
            playerOutcomeOutput.innerText = `You have a total of ${playerTotal}`;
            playerResultOutput.innerText = "You've gone bust, play again!";
            refreshBtn.style.visibility = 'visible';
        } else if (playerTotal === 21) {
            playerOutcomeOutput.innerText = `Total: ${playerTotal}`;
            playerResultOutput.innerText = '21!!! Congratualtions you have won!';
            refreshBtn.style.visibility = 'visible';
            playerStop();
        }
    }
    if (playerTurn === false && playerHold === true) {
        //TODO: Sort the Comparison on the dealers score and convert to a swtich statment
        if (dealerTotal > 21) {
            dealerResultOutput.innerText = `The Dealer has gone bust, you win`;
            playerStop();
        } else if (dealerTotal === 21) {
            dealerResultOutput.innerText = `The dealer has won with 21, Unlucky!`;
            playerStop();
        } else if (dealerTotal > playerFinalTotal && dealerTotal < 21) {
            dealerResultOutput.innerText = `The dealer wins by beating your score, Unlucky!`;
            playerStop();
        } else {
            stopDealer = setTimeout(addCardDealer, 1750);
        }
    }
}
//this function add another card from the deck to the players hand after the "Hit" button is pressed 
function addCard() {
    cardIndex = playerHand.length;
    for (let i = 0; i < playerHand.length; i++) {
        playerHand[cardIndex] = shuffledCards[cardIndex];
    }
    cardUiPosition = cardIndex;
    playerCard[cardIndex].style.visibility = 'visible';
    playerCard[cardIndex] = cardFrontCreation(playerHand[cardIndex].suit, playerHand[cardIndex].name);
    playerOutcomeOutput.innerText = `You have a total of ${playerTotal}`;
}

//This fuction updates the UI on the current score and cards drawn and is the main hub contorller
function displayTotal() {
    const resultsh = []; //temp empty array for the card text to go in
    playerTotal = 0; //on each call of the fuction the score goes to 0
    if (playerTurn === true) {
        for (i = 0; i < playerHand.length; i++) {
            showCard = ` ${playerHand[i].name} of ${playerHand[i].suit}`; //grabs and joins each card name (name, suit)
            playerTotal = playerTotal + playerHand[i].value; //add thep layer total for the current hand
            resultsh.push(showCard); //adds current card on itteration to deck
        }
        playerScoreOutput.innerText = `Current Hand is:${resultsh}`;
        playerOutcomeOutput.innerText = `You have a total of ${playerTotal}`;
        cardValueCheck();
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
        cardValueCheck();
    }
}

//This fucntion is called when the player has decided to stand or has lost with his current hand
function playerStop() {
    dealerStop();
    playerTurn = false;
    cardIndex = cardIndex + 1;
    hitBtn.disabled = true;
    hitBtn.style.color = 'grey';
    standBtn.disabled = true;
    standBtn.style.color = 'grey';
}


//These next set of fuctions are event listeners for the UI elements
hitBtn.addEventListener('click', () => {
    addCard();
    displayTotal();
});

standBtn.addEventListener('click', () => {
    playerFinalTotal = playerTotal;
    playerHold = true;
    refreshBtn.style.visibility = 'visible';
    playerStop();
    playerOutcomeOutput.innerText = `You have stand with a total of ${playerFinalTotal}`;
    dealerLogic();
})

//This fucntions initialise the logic for reseting the game
refreshBtn.addEventListener('click', () => {
    resetGame();
    shuffle();
    firstDraw();
})

showRules.addEventListener('click', () => {
    modal.classList.add('fade-show');
    modal.style.visibility = 'visible';
})

exitRules.addEventListener('click', () => {
    modal.style.visibility = 'hidden';
    modal.classList.remove('fade-show');
})


//This fuction sets up the logic of the dealers initial draw
function dealerLogic() {
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
    cardId++;
    displayTotal()
}

//This funciton is similar to the player addcard fuction but this is automated until there is a win/lose condition
function addCardDealer() {
    i = dealerHand.length;
    dealerHand[i] = shuffledCards[cardId + 1];
    dealerCard[i].style.visibility = 'visible';
    dealerCard[i] = cardFrontCreation(dealerHand[i].suit, dealerHand[i].name);
    cardUiPosition++;
    cardId++;
    displayTotal();
}


//This funciton resets the game and UI to it's initial state so the player and play again
function resetGame() {
    dealerStop();
    playerHand = [];
    shuffledCards = [];
    dealerHand = [];
    cardIndex = 0;
    dealerTotal = 0;
    playerTotal = 0;
    playerFinalTotal = 0;
    cardId = 0;
    cardUiPosition = 0;
    playerTurn = true;
    playerHold = false;
    playerOutcomeOutput.innerText = ``;
    playerScoreOutput.innerText = ``;
    playerResultOutput.innerText = ``;
    dealerScoreOutput.innerText = ``;
    dealerOutcomeOutput.innerText = ``;
    dealerResultOutput.innerText = ``;
    hitBtn.disabled = false;
    standBtn.disabled = false;
    refreshBtn.style.visibility = 'hidden';
    hitBtn.style.color = 'white';
    standBtn.style.color = 'white';
    cardFrontUI.forEach((card) => {
        card.style.visibility = 'hidden';
        card.children.innerHTML = '';
    });
    playerCard[0].style.visibility = 'visible';
    playerCard[1].style.visibility = 'visible';
}

//This function stop the settimeout function so doesn't wreack the new game 
function dealerStop() {
    clearTimeout(stopDealer);
}

//These are the initial invoc fuctions to start the game
shuffle();
firstDraw();