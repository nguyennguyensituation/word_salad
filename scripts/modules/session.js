import { Game } from "./game.js";
import { GAME_DATA } from "./game_data.js";
import { bounceAnimation, shakeAnimation } from "./animations.js";

class Session {
  constructor() {
    this.playedGameIndexes = [];
    this.data = this.getGameData();
    this.game = new Game(this.data);
    this.subHeading = document.getElementById('subheading');
    this.cardsContainer = document.getElementById('cards-container');
    this.mistakesContainer = document.getElementById('mistakes-container');
    this.gameControlsContainer = document.getElementById('game-controls-container');
    this.puzzleModal = document.getElementById('puzzle-modal');
    this.playAgainBtn = document.getElementById('play-again-btn');
  }

  init() {
    this.registerTemplates();
    this.renderDeck();
    this.renderRemainingMistakes();
    this.bindEvents();
  }

  getGameData() {
    let idx = Math.floor(Math.random() * GAME_DATA.length);

    if (!this.playedGameIndexes.includes(idx)) {
      this.playedGameIndexes.push(idx);
      return GAME_DATA[idx];
    }

    return this.getGameData();
  }

  submitCorrectCards(category) {
    setTimeout(() => {
      this.showCategory(category);

      if(this.game.solvedCategories.length === 4) { 
        this.subHeading.innerHTML = "You found all the categories! Great job!";
        this.toggleDisplay(this.gameControlsContainer);
        this.toggleDisplay(this.playAgainBtn, 'show');
      }
    }, 1500);
  }

  submitIncorrectCards(selectedCardDivs) {
    setTimeout(() => {
      shakeAnimation(selectedCardDivs);
      this.decrementMistakesCounter();
          
      if (this.game.mistakesRemaining === 0) {
        setTimeout(() => {
          this.toggleDisplay(this.gameControlsContainer);
          this.showAllCategories();
          this.subHeading.innerHTML = "Better luck next time!";
          this.toggleDisplay(this.playAgainBtn, 'show');
        }, 1000);
      }
    }, 1500);
  }

  decrementMistakesCounter() {
    const dot = this.mistakesContainer.querySelector('.dot');
    this.mistakesContainer.removeChild(dot);
    this.game.mistakesRemaining -= 1;
  }

  getUnsolvedCategoryNames() {
    const allCategoryNames = this.data.categories.map(category => category.categoryName);

    return allCategoryNames.filter(name => {
      return this.game.solvedCategories.findIndex(solvedCat => solvedCat.name === name) === -1;
    });
  }

  getCategoryDetails(name) {
    const category = this.data.categories.find(category => category.categoryName === name);
    const difficulty = category.difficulty;
    const words = category.categoryWords.map(word => word.wordValue).join(', ');

    return {
      name,
      difficulty,
      words,
    }
  }

  resetPuzzle() {
    this.puzzleModal.classList.remove(`${this.game.currentCard.puzzle.type}-puzzle`);
    this.toggleDisplay(this.puzzleModal);
  }

  resetGame() {
    this.data = this.getGameData();
    this.game = new Game(this.data);
  }

  resetSession() {
    this.resetGame();
    this.renderCategories();
    this.renderDeck();
    this.renderRemainingMistakes();
    this.toggleDisplay(this.playAgainBtn);
    this.toggleDisplay(this.gameControlsContainer, 'show');
    this.subHeading.innerHTML = "First, solve the puzzles on the blank cards to reveal the missing words..."
  }

  toggleDisplay(element, mode = 'hide') {
    mode === 'hide' ? element.classList.add('hide') : element.classList.remove('hide');
  }

  showMessage(message) {
    const gameMessage = document.getElementById('game-message');
    gameMessage.innerHTML = message;
    this.toggleDisplay(gameMessage, 'show');

    // Hides message after 1.2 seconds
    setTimeout(() => {
      this.toggleDisplay(gameMessage);
    }, 1200)
  }

  showCardValue(isWinner) {
    this.game.currentCard.cardSolved = isWinner;
    this.game.currentCard.letters = this.game.currentCard.winningLetters();
  }

  showCategory(category) {
    this.game.solvedCategories.push(this.getCategoryDetails(category));
    this.game.deck = this.game.deck.filter(card => !this.game.selectedCards.includes(card));
    this.game.resetSelectedCards();
    this.renderCategories();
    this.renderDeck();
  }

  showAllCategories() {
    const unsolvedCategories = this.getUnsolvedCategoryNames()
    
    unsolvedCategories.forEach(category => {
      const categoryDetails = this.getCategoryDetails(category);
      
      this.game.solvedCategories.push(categoryDetails);
    })

    this.game.deck = [];
    this.renderCategories();
    this.renderDeck();
  }

  renderDeck() {
    this.cardsContainer.innerHTML = this.cardTemplate({cards: this.game.deck});
  }

  renderPuzzle(puzzle) {  
    if (puzzle.type === 'wordle') {
      const wordleData = { rows: [0, 1, 2, 3, 4, 5]}

      this.puzzleModal.innerHTML = this.wordleTemplate(wordleData);
    } else if (puzzle.type === 'crossword') {
      let mistakesArr = [];

      for (let i = 0; i < puzzle.crosswordMistakesRemaining; i += 1) {
        mistakesArr.push(i);
      }

      const crosswordData = {
        crosswordClue: puzzle.crosswordClue, 
        letters: puzzle.letters, 
        mistakesRemaining: mistakesArr
      }

      this.puzzleModal.innerHTML = this.crosswordTemplate(crosswordData);
    }

    this.toggleDisplay(this.puzzleModal, 'show');
  }

  renderCategories() {
    const categoriesContainer = document.getElementById('categories-container');

    categoriesContainer.innerHTML = this.categoryTemplate({categories: this.game.solvedCategories});
  }

  renderRemainingMistakes() {
    this.mistakesContainer.innerHTML = this.mistakesTemplate({ mistakesRemaining: [0, 1, 2, 3] })
  }

  registerTemplates() { 
    this.cardTemplate = Handlebars.compile(document.getElementById("card-template").innerHTML);
    this.categoryTemplate = Handlebars.compile(document.getElementById('category-template').innerHTML);
    this.mistakesTemplate = Handlebars.compile(document.getElementById('mistakes-dot-template').innerHTML);
    this.wordleTemplate = Handlebars.compile(document.getElementById('wordle-template').innerHTML);
    this.crosswordTemplate = Handlebars.compile(document.getElementById('crossword-template').innerHTML);
    Handlebars.registerPartial('wordleRowTemplate', document.getElementById('wordle-row-template').innerHTML);
    Handlebars.registerHelper('noPuzzle', puzzle => puzzle.type === 'none');
    Handlebars.registerHelper('isWordle', puzzle => puzzle.type === 'wordle');
    Handlebars.registerHelper('isCrossword', puzzle => puzzle.type === 'crossword');
  }

  bindEvents() {
    const categorySubmitBtn = document.getElementById('submit-btn');
  
    // Select/unselect card
    this.cardsContainer.addEventListener('click', event => {
      const cardDiv = event.target.closest('article.card');
      const id = parseInt(cardDiv.id.replace("card-", ""));
      this.game.currentCard = this.game.getCardById(id);

      const move = this.game.currentCard.puzzle.puzzlePlayed ? 'selectCard' : 'playPuzzle';
      
      if (move === 'selectCard') {
        this.game.selectCard();
        this.renderDeck();
      } else if (move === 'playPuzzle') { 
        this.puzzleModal.classList.add(`${this.game.currentCard.puzzle.type}-puzzle`);
        this.renderPuzzle(this.game.currentCard.puzzle);  
      } 

      // Hide submit button if fewer than 4 cards selected
      categorySubmitBtn.disabled = this.game.selectedCards.length < 4;
    });

    // Unselect all cards
    const deselectBtn = document.getElementById('deselect-btn');

    deselectBtn.addEventListener('click', () => { 
      this.game.resetSelectedCards(); 
      this.renderDeck();
    });

    // Submit cards
    categorySubmitBtn.addEventListener('click', () => {
      const selectedCardDivs = [...document.getElementsByClassName('selected')];
      const duplicateCards = this.game.isDuplicateGuess();

      if (duplicateCards) {
        shakeAnimation(selectedCardDivs);
        this.showMessage("Already guessed!");
      } else {
        bounceAnimation(selectedCardDivs);
        this.game.guessedCards.push(this.game.selectedCards);
  
        const selectedCategories = this.game.selectedCategories();

        if (selectedCategories.length === 1) {
          this.submitCorrectCards(selectedCategories[0]);
        } else if (selectedCategories.length === 2) {
          this.showMessage("One away!");
          this.submitIncorrectCards(selectedCardDivs);
        } else {
          this.submitIncorrectCards(selectedCardDivs);
        }

        categorySubmitBtn.disabled = true;
      }
    });

    // Shuffle cards
    const shuffleBtn = document.getElementById('shuffle-btn');

    shuffleBtn.addEventListener('click', () => {
      this.game.deck = this.game.shuffle(this.game.deck);
      this.renderDeck();
    });

    // Play new game
    this.playAgainBtn.addEventListener('click', () => {
      this.resetSession();
    })

    // Play wordle or crossword puzzle
    document.addEventListener('keydown', event => {
      const inPuzzleMode = !this.puzzleModal.classList.contains('hide');

      if (inPuzzleMode) {
        const currentPuzzle = this.game.currentCard.puzzle;

        currentPuzzle.playPuzzle.call(currentPuzzle, event.key)
        
        if (currentPuzzle.puzzlePlayed) {
          const closePuzzleBtn = document.querySelector('.close-puzzle-btn');

          this.showCardValue(currentPuzzle.puzzleSolved);
          this.game.puzzlesRemaining -= 1;
          this.toggleDisplay(closePuzzleBtn, 'show');

          closePuzzleBtn.addEventListener('click', () => {
            this.renderDeck();
            this.resetPuzzle(); 
          });
        }

        if (this.game.puzzlesRemaining === 0) {
          this.subHeading.innerHTML = 'All the puzzles have been solved! Now, create four groups of four!'
        }
      }
    });

    // Submit crossword answer
    this.puzzleModal.addEventListener('click', event => {
      const submitCrosswordGuess = event.target === document.getElementById('crossword-submit-btn');

      if (submitCrosswordGuess) {
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
      }
    })
  }
}

export { Session };