class Game {
  constructor() {
    this.data = GAME_DATA[0];
    this.deck = this.createDeck();
    this.registerTemplates();

    // Connections
    this.subHeading = document.getElementById('subheading');
    this.cardsContainer = document.getElementById('cards-container');
    this.categoriesContainer = document.getElementById('categories-container');
    this.gameControlsContainer = document.getElementById('game-controls-container');
    this.mistakesContainer = document.getElementById('mistakes-container');
    this.mistakesRemaining = 4;
    this.puzzlesRemaining = 8;
    this.selectedCards = [];
    this.solvedCategories = [];

    // Puzzles
    this.currentCard;
    this.puzzleModal = document.getElementById('puzzle-modal');
    this.puzzleTitle = document.getElementById('puzzle-title');
    this.puzzleContainer = document.getElementById('puzzle-container');
    this.puzzleMessage = document.getElementById('puzzle-message');
    this.closePuzzleBtn = document.getElementById('close-puzzle-btn');
    this.crosswordClue = document.getElementById('crossword-clue');
    this.crosswordMistakesContainer = document.getElementById('crossword-mistakes-container');
    this.crosswordSubmitBtn = document.getElementById('crossword-submit-btn');
  }

  init() {
    this.renderDeck();
    this.bindEvents();
  }

  // Create array of Card objects
  createDeck() {
    let deck = [];
    let id = 0;

    this.data.categories.forEach(category => {
      category.categoryWords.forEach(word => {
        deck.push(new Card(id, category.categoryName, word));
        id += 1;
      })
    })

    return this.shuffleDeck(deck)
  }

  shuffleDeck(deck) {
    return deck.sort(() => 0.5 - Math.random());
  }

  getCardById(id) {
    return this.deck.find(card => card.id === id);
  }

  getAllCategoryNames() {
    return this.data.categories.map(category => category.categoryName);
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

  renderDeck() {
    this.cardsContainer.innerHTML = this.cardTemplate({cards: this.deck});
  }

  renderSolvedCategories() {
    this.categoriesContainer.innerHTML = this.categoryTemplate({categories: this.solvedCategories});
  }

  renderPuzzle(puzzle) {  
    this.puzzleTitle.innerHTML = puzzle.type;

    if (puzzle.type === 'wordle') {
      this.puzzleContainer.innerHTML = this.wordleTemplate({ rows: [0, 1, 2, 3, 4, 5]});
    } else if (puzzle.type === 'crossword') {
      this.puzzleContainer.innerHTML = this.crosswordTemplate({ letters: puzzle.letters});

      this.crosswordMistakesContainer.innerHTML = this.mistakesCountTemplate({});
      this.crosswordClue.innerHTML = puzzle.crosswordClue;
    }
  }

  // Show solved card
  ShowCardValue(isWinner) {
    this.currentCard.cardSolved = isWinner;
    this.currentCard.letters = this.currentCard.winningLetters();
  }

  showAllCategories() {
    const categoryNames = this.getAllCategoryNames();
      this.solvedCategories = categoryNames.map(name => this.getCategoryDetails(name));
      this.deck = [];

      this.renderSolvedCategories();
      this.renderDeck();
  }

  showElement(...elements) {
    elements.forEach(element => { element.classList.remove('hide'); })
  }

  hideElement(...elements) {
    elements.forEach(element => { element.classList.add('hide'); })
  }

  registerTemplates() { 
    this.cardTemplate = Handlebars.compile(document.getElementById("card-template").innerHTML);
    this.categoryTemplate = Handlebars.compile(document.getElementById('category-template').innerHTML);
    this.wordleTemplate = Handlebars.compile(document.getElementById('wordle-template').innerHTML);
    this.crosswordTemplate = Handlebars.compile(document.getElementById('crossword-template').innerHTML);
    this.mistakesCountTemplate = Handlebars.compile(document.getElementById('mistakes-count-template').innerHTML);
    Handlebars.registerPartial('wordleRowTemplate', document.getElementById('wordle-row-template').innerHTML);
    Handlebars.registerHelper('noPuzzle', function (puzzle) {
      return puzzle.type === 'none';
    });
    Handlebars.registerHelper('isWordle', function (puzzle) {
      return puzzle.type === 'wordle';
    });
    Handlebars.registerHelper('isCrossword', function (puzzle) {
      return puzzle.type === 'crossword';
    });
  }

  shakeAnimation(divs) {
    divs.forEach(div => {
      div.classList.add('shake');

      setTimeout(() => {
        div.classList.remove('shake');
      }, 500) 
    });
  }

  selectCard(div) {
    const isSelectable = this.selectedCards.length < 4 && !div.classList.contains('selected');

    if (isSelectable) {
      div.classList.add('selected');
      this.selectedCards.push(this.currentCard);
    } else {
      div.classList.remove('selected');
      this.selectedCards = this.selectedCards.filter(card => card !== this.currentCard);
    }
  }

  bindEvents() {
    const categorySubmitBtn = document.getElementById('submit-btn');
  
    // Select and unselect card
    this.cardsContainer.addEventListener('click', event => {
      const cardDiv = event.target.closest('div.card');
      const id = parseInt(cardDiv.id.replace("card-", ""));
      this.currentCard = this.getCardById(id);
      const currentMove = this.currentCard.puzzle.puzzlePlayed ? 'selectCard' : 'playPuzzle';
      
      if (currentMove === 'selectCard') {
        this.select(cardDiv);
      } else if (currentMove === 'playPuzzle') { 
        this.puzzleModal.classList.add(`${this.currentCard.puzzle.type}-puzzle`);
        this.renderPuzzle(this.currentCard.puzzle);  
        this.showElement(this.puzzleModal);
      } 

      // Hide submit button if fewer than 4 cards selected
      categorySubmitBtn.disabled = this.selectedCards.length < 4;
    });

    // Submit cards
    categorySubmitBtn.addEventListener('click', () => {
      const matchingCategory = this.allCategoriesMatch() ?? null;
      const selectedCardDivs = [...document.getElementsByClassName('selected')];
      
      this.bounceAnimation(selectedCardDivs);

      setTimeout(() => {
        if (matchingCategory) {   
          // Show completed category and remove selectedCards from deck
          this.solvedCategories.push(this.getCategoryDetails(matchingCategory));
          this.deck = this.deck.filter(card => !this.selectedCards.includes(card));
          this.resetSelectedCards();
          this.renderSolvedCategories();
          this.renderDeck();

          if(this.solvedCategories.length === 4) { 
            this.subHeading.innerHTML = "You found all the categories! Great job!";
            this.hideElement(this.gameControlsContainer);
          }
        } else {
          this.shakeAnimation(selectedCardDivs);

          // Decrement mistakes counter
          const dot = this.mistakesContainer.querySelector('.dot');
          this.mistakesContainer.removeChild(dot);
          this.mistakesRemaining -= 1;
              
          // Show all categories and losing message
          if (this.mistakesRemaining === 0) {
            setTimeout(() => {
              const gameControlsContainer = document.getElementById('game-controls-container');
              gameControlsContainer.classList.add('hide');
              this.showAllCategories();
              this.subHeading.innerHTML = "Better luck next time!";
            }, 1000);
          }
        }
      }, 1500);

      // Hide submit button
      categorySubmitBtn.disabled = true;
    });

    // Deselect all cards
    const deselectBtn = document.getElementById('deselect-btn');

    deselectBtn.addEventListener('click', () => { this.resetSelectedCards(); });

    // Shuffle cards
    const shuffleBtn = document.getElementById('shuffle-btn');

    shuffleBtn.addEventListener('click', () => {
      this.deck = this.shuffleDeck(this.deck);
      this.resetSelectedCards()
      this.renderDeck();
    });

    // Play wordle or crossword puzzle
    document.addEventListener('keydown', event => {
      const currentPuzzle = this.currentCard.puzzle;
      const playPuzzle = currentPuzzle.type === 'wordle' ? currentPuzzle.playWordle : currentPuzzle.playCrossword;

      playPuzzle.call(currentPuzzle, event.key);
      
      if (currentPuzzle.puzzlePlayed) {
        this.ShowCardValue(currentPuzzle.puzzleSolved);
        this.puzzlesRemaining -= 1;
        this.closePuzzleBtn.classList.remove('hide');
      }

      if (this.puzzlesRemaining === 0) {
        this.subHeading.innerHTML = 'Now, create four groups of four!'
      }
    });

    // Close puzzle modal
    this.closePuzzleBtn.addEventListener('click', () => {
      this.renderDeck();
      this.resetPuzzle(); 
    });
  }

  // Return true if categoryNames for all cards are the same
  allCategoriesMatch() {
    const firstCategory = this.selectedCards[0].categoryName;

    if (this.selectedCards.every(card => card.categoryName === firstCategory)) {
      return firstCategory;
    }
  }

  // TODO remove after refactoring handlebars puzzleTemplate
  resetPuzzle() {
    // Reset puzzle content
    const puzzleContent = [this.puzzleMessage, this.crosswordClue, this.crosswordMistakesContainer]

    puzzleContent.forEach(element => element.innerHTML = '');

    // Hide puzzle divs
    const puzzleDivs = [this.puzzleMessage, this.closePuzzleBtn, this.puzzleModal]

    this.puzzleModal.classList.remove(`${this.currentCard.puzzle.type}-puzzle`);
    puzzleDivs.forEach(div => this.hideElement(div));
  }

  resetSelectedCards() {
    const selectedCardDivs = [...document.getElementsByClassName('selected')];

    selectedCardDivs.forEach(card => card.classList.remove('selected'));

    this.selectedCards = [];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const myGame = new Game;
  myGame.init();
})

