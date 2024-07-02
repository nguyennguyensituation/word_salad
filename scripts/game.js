class Game {
  constructor() {
    this.data = GAME_DATA[0];
    this.deck = this.createDeck();
    this.currentCard;
    this.selectedCards = [];
    this.guessedCards = [];
    this.solvedCategories = [];
    this.mistakesRemaining = 4;
    this.puzzlesRemaining = 8;
    this.subHeading = document.getElementById('subheading');
    this.cardsContainer = document.getElementById('cards-container');
    this.puzzleModal = document.getElementById('puzzle-modal');
  }

  init() {
    this.registerTemplates();
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

  getUnsolvedCategoryNames() {
    const allCategoryNames = this.data.categories.map(category => category.categoryName);

    return allCategoryNames.filter(name => {
      return this.solvedCategories.findIndex(solvedCat => solvedCat.name === name) === -1;
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

  renderDeck() {
    this.cardsContainer.innerHTML = this.cardTemplate({cards: this.deck});
  }

  renderSolvedCategories() {
    const categoriesContainer = document.getElementById('categories-container');

    categoriesContainer.innerHTML = this.categoryTemplate({categories: this.solvedCategories});
  }

  renderPuzzle(puzzle) {  
    if (puzzle.type === 'wordle') {
      this.puzzleModal.innerHTML = this.wordleTemplate({ rows: [0, 1, 2, 3, 4, 5]});
    } else if (puzzle.type === 'crossword') {
      let mistakesArr = [];

      for (let i = 0; i < puzzle.crosswordMistakesRemaining; i += 1) {
        mistakesArr.push(i);
      }

      const crosswordTemplateData = {
        crosswordClue: puzzle.crosswordClue, 
        letters: puzzle.letters, 
        mistakesRemaining: mistakesArr
      }

      this.puzzleModal.innerHTML = this.crosswordTemplate(crosswordTemplateData);
    }
  }

  // Show solved card
  showCardValue(isWinner) {
    this.currentCard.cardSolved = isWinner;
    this.currentCard.letters = this.currentCard.winningLetters();
  }

  showAllCategories() {
    const unsolvedCategories = this.getUnsolvedCategoryNames()
    
    unsolvedCategories.forEach(category => {
      const categoryDetails = this.getCategoryDetails(category);
      
      this.solvedCategories.push(categoryDetails);
    })

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
    Handlebars.registerPartial('wordleRowTemplate', document.getElementById('wordle-row-template').innerHTML);
    Handlebars.registerHelper('noPuzzle', (puzzle) => {
      return puzzle.type === 'none';
    });
    Handlebars.registerHelper('isWordle', (puzzle) => {
      return puzzle.type === 'wordle';
    });
    Handlebars.registerHelper('isCrossword', (puzzle) => {
      return puzzle.type === 'crossword';
    });
  }

  bindEvents() {
    const categorySubmitBtn = document.getElementById('submit-btn');
  
    // Select and unselect card
    this.cardsContainer.addEventListener('click', event => {
      const cardDiv = event.target.closest('article.card');
      const id = parseInt(cardDiv.id.replace("card-", ""));
      this.currentCard = this.getCardById(id);
      const currentMove = this.currentCard.puzzle.puzzlePlayed ? 'selectCard' : 'playPuzzle';
      
      if (currentMove === 'selectCard') {
        this.selectCard(this.currentCard);
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
      const gameControlsContainer = document.getElementById('game-controls-container');
      const alreadyGuessed = this.alreadyGuessed(this.selectedCards);


      if (alreadyGuessed) {
        shakeAnimation(selectedCardDivs);
        this.showMessage("Already guessed!");
      } else {
        this.guessedCards.push(this.selectedCards);
        bounceAnimation(selectedCardDivs);
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
              this.hideElement(gameControlsContainer);
            }
          } else {
            shakeAnimation(selectedCardDivs);
  
            // Decrement mistakes counter
            const mistakesContainer = document.getElementById('mistakes-container');  
            const dot = mistakesContainer.querySelector('.dot');
            mistakesContainer.removeChild(dot);
            this.mistakesRemaining -= 1;
                
            // Show all categories and losing message
            if (this.mistakesRemaining === 0) {
              setTimeout(() => {
                gameControlsContainer.classList.add('hide');
                this.showAllCategories();
                this.subHeading.innerHTML = "Better luck next time!";
              }, 1000);
            }
          }
        }, 1500);
  
        // Hide submit button
        categorySubmitBtn.disabled = true;
      }
    });

    // Deselect all cards
    const deselectBtn = document.getElementById('deselect-btn');

    deselectBtn.addEventListener('click', () => { this.resetSelectedCards(); });

    // Shuffle cards
    const shuffleBtn = document.getElementById('shuffle-btn');

    shuffleBtn.addEventListener('click', () => {
      this.deck = this.shuffleDeck(this.deck);
      this.renderDeck();
    });

    // Play wordle or crossword puzzle
    document.addEventListener('keydown', event => {
      const currentPuzzle = this.currentCard.puzzle;

      currentPuzzle.playPuzzle.call(currentPuzzle, event.key)
      
      if (currentPuzzle.puzzlePlayed) {
        this.closePuzzleBtn = document.getElementById('close-puzzle-btn');

        this.showCardValue(currentPuzzle.puzzleSolved);
        this.puzzlesRemaining -= 1;
        this.closePuzzleBtn.classList.remove('hide');
        this.closePuzzleBtn.addEventListener('click', () => {
          this.renderDeck();
          this.resetPuzzle(); 
        });
      }

      if (this.puzzlesRemaining === 0) {
        this.subHeading.innerHTML = 'All the puzzles have been solved! Now, create four groups of four!'
      }
    });
  }

  showMessage(message) {
    const gameMessage = document.getElementById('game-message');
    gameMessage.innerHTML = message;
    gameMessage.classList.remove('hide');

    // Hides message after 1.2 seconds
    setTimeout(() => {
      gameMessage.classList.add('hide');
    }, 1200)
  }

  selectCard(card) {
    const isSelectable = this.selectedCards.length < 4 && !card.selected;

    if (isSelectable) {
      card.selected = true;
      this.selectedCards.push(card);
    } else {
      card.selected = false;
      this.selectedCards = this.selectedCards.filter(selectedCard => selectedCard !== card);
    }

    this.renderDeck();
  }

  // Return true if all selected Cards match a set of previously selected Cards
  allCardsMatch(selectedCards, previousSelection) {
    return selectedCards.every(card => previousSelection.includes(card));
  }

  alreadyGuessed(selectedCards) {
    return this.guessedCards.some(previousGuess => this.allCardsMatch(selectedCards, previousGuess));
  }
     
  resetSelectedCards() {
    this.selectedCards.forEach(card => card.selected = false);
    this.selectedCards = [];
    this.renderDeck();
  }

  // Return true if categoryNames for all cards are the same
  allCategoriesMatch() {
    const firstCategory = this.selectedCards[0].categoryName;

    if (this.selectedCards.every(card => card.categoryName === firstCategory)) {
      return firstCategory;
    }
  }

  resetPuzzle() {
    this.puzzleModal.classList.remove(`${this.currentCard.puzzle.type}-puzzle`);
    this.hideElement(this.puzzleModal);
  }
}