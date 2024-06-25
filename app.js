const GAME_DATA = [
  {
    id: 1,
    categories: [
      {
        difficulty: 1,
        categoryName: "CORE",
        categoryWords: [
          { wordValue: 'CRUX', miniPuzzle: 'crossword', crosswordClue: "Gist"},
          { wordValue: 'ESSENCE', miniPuzzle: 'none'},
          { wordValue: 'HEART', miniPuzzle: 'wordle' },
          { wordValue: 'SUBSTANCE', miniPuzzle: 'none'},
        ]
      },
      {
        difficulty: 2,
        categoryName: "COMPLICATED",
        categoryWords: [
          { wordValue: 'BAROQUE', miniPuzzle: 'crossword', crosswordClue: "Music style popularized by Bach" },
          { wordValue: 'COMPLEX', miniPuzzle: 'none'},
          { wordValue: 'ELABORATE', miniPuzzle: 'none'},
          { wordValue: 'MESSY', miniPuzzle: 'wordle'},
        ]
      },
      {
        difficulty: 3,
        categoryName: "SYMBOLS USED IN MAKING LISTS",
        categoryWords: [
          { wordValue: 'ARROW', miniPuzzle: 'wordle'},
          { wordValue: 'BULLET', miniPuzzle: 'crossword', crosswordClue: "Muggsy Bogues or Manute Bol, once" },
          { wordValue: 'CHECKBOX', miniPuzzle: 'none' },
          { wordValue: 'HYPHEN', miniPuzzle: 'none' },
        ]
      },
      {
        difficulty: 4,
        categoryName: "WHAT 'CROSS' MIGHT MEAN",
        categoryWords: [
          { wordValue: 'ANGRY', miniPuzzle: 'wordle'},
          { wordValue: 'BETRAY', miniPuzzle: 'none'},
          { wordValue: 'CRUCIFIX', miniPuzzle: 'crossword', crosswordClue: "One of those 'T' necklaces, maybe" },
          { wordValue: 'HYBRID', miniPuzzle: 'none'},
        ]
      },
    ]
  }
]

class Card {
  constructor(id, categoryName, wordData) {
    this.id = id;
    this.categoryName = categoryName;
    this.wordValue = wordData.wordValue;
    this.noPuzzle = wordData.miniPuzzle === 'none';
    this.wordle = wordData.miniPuzzle === 'wordle';
    this.crossword = wordData.miniPuzzle === 'crossword';
    this.crosswordClue = wordData.crosswordClue;
    this.letters = this.noPuzzle ? null : this.blankSpaces() ;
    this.cardSolved = this.noPuzzle;
    this.puzzlePlayed = this.noPuzzle;
  }

  // Return string of empty spaces for puzzle default value
  blankSpaces() {
    return this.wordValue.replace(/./g, ' ').split('');
  }  
  
  // Return array of all letters in word
  winningLetters() {
    return this.wordValue.toLowerCase().split('');
  }
}

class Game {
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
    this.puzzleTitle.innerHTML = puzzle;

    if (puzzle === 'wordle') {
      this.puzzleContainer.innerHTML = this.wordleTemplate({ rows: [0, 1, 2, 3, 4, 5]});
    } else if (puzzle === 'crossword') {
      this.puzzleContainer.innerHTML = this.crosswordTemplate({ letters: this.currentCard.letters});
      this.crosswordMistakesContainer.innerHTML = this.mistakesCountTemplate({});
      this.crosswordClue.innerHTML = this.currentCard.crosswordClue;
    }
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
  }

  bounceAnimation(divs) {
    let timer = 0;

    divs.forEach(div => {
      setTimeout(() => {
        div.classList.add('bounce');
      }, timer);

      setTimeout(() => {
        div.classList.remove('bounce');
      }, timer + 1000);
      timer += 100;
    })
  }

  shakeAnimation(divs) {
    divs.forEach(div => {
      div.classList.add('shake');

      setTimeout(() => {
        div.classList.remove('shake');
      }, 500) 
    });
  }

  bindEvents() {
    const categorySubmitBtn = document.getElementById('submit-btn');
  
    // Select and unselect card
    this.cardsContainer.addEventListener('click', event => {
      const cardDiv = event.target.closest('div.card');
      const id = parseInt(cardDiv.id.replace("card-", ""));
      this.currentCard = this.getCardById(id);
      const cardIsSelectable = this.currentCard.puzzlePlayed;
      
      if (cardIsSelectable) {
        if (this.selectedCards.length < 4 && !cardDiv.classList.contains('selected')) {
          // Select/highlight currentCard and add to selectedCards array
          cardDiv.classList.add('selected');
          this.selectedCards.push(this.currentCard);
        } else {
          // Unselect/remove highlight from currentCard and remove from selectedCards array
          cardDiv.classList.remove('selected');
          this.selectedCards = this.selectedCards.filter(card => card !== this.currentCard);
        }
      } else { 
        // Show appropriate puzzle
        const puzzleType = this.currentCard.wordle ? 'wordle' : 'crossword';

        this.puzzleModal.classList.add(`${puzzleType}-puzzle`);
        this.renderPuzzle(puzzleType);  
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
    document.addEventListener('keypress', event => {
      const playPuzzle = this.puzzleModal.classList.contains('wordle-puzzle') ? this.playWordle : this.playCrossword;

      playPuzzle.call(this, event.key, this.currentCard.winningLetters());
    });

    // Close puzzle modal
    this.closePuzzleBtn.addEventListener('click', () => {
      this.renderDeck();
      this.resetPuzzle(); 
    });
  }

  playWordle(input, winningLetters) {
    let activeTile = document.querySelector('.tile:not(.has-value)');
    const row = document.querySelector('.incomplete-row');
    const isFirstTile = row.firstElementChild === activeTile;
    const rowComplete = this.guessedLetters.length === 5;
    
    if (this.isLetter(input) && !rowComplete) {
      // Add letter to tile
      this.updateLetter(activeTile, input);
    } else if (input === 'Backspace') {
      // If row has not been submitted, remove letter from last tile that contains a letter. Else, do nothing
      if (rowComplete) {
        activeTile = row.lastElementChild;
      } else if (!isFirstTile) {
        activeTile = activeTile.previousElementSibling;
      }

      this.updateLetter(activeTile)
    } else if (input === 'Enter' && rowComplete) {
      // Check if row is a winner and add styling to tiles
      const results = this.checkWordleGuess(this.guessedLetters, winningLetters);
      const tiles = row.children;

      results.forEach((status, idx) => tiles[idx].classList.add(status));
      row.classList.remove('incomplete-row');
      this.guessedLetters = [];

      // Check if puzzle is winner or we are on the last row
      const isWinner = results.every(result => result === 'correct');
      const isLastRow = row.id === 'row-5';

      if (isWinner) { 
        const letterDivs = [...row.children];

        this.bounceAnimation(letterDivs);
        this.showPuzzleResult();
      } else if (isLastRow) {
        this.showPuzzleResult(false);
      }
    }
  }

  // Return array of results for each guessed letter, accounting for duplicate letters
  checkWordleGuess(guessedLetters, winningLetters) {
    let winningLettersArr = [...winningLetters];
    let results = guessedLetters.map((letter, idx) => {
      if (letter === winningLettersArr[idx]) {
        winningLettersArr[idx] = '';
        return 'correct';
      } else if (!winningLettersArr.includes(letter)) {
        return 'incorrect-letter';
      } else {
        return 'incorrect-position';
      }
    });

    // Check for duplicate letters
    results.forEach((result, idx) => {
      if (result === 'incorrect-position') {
        if (winningLettersArr.includes(guessedLetters[idx])) {
          const wordIdx = winningLettersArr.findIndex( letter => letter === guessedLetters[idx]);
          winningLettersArr[wordIdx] = '';
        } else {
          results[idx] = 'incorrect-letter';
        }
      }
    })

    return results;
  }

  playCrossword(input) {
    const winningWord = this.currentCard.wordValue.toLowerCase();
    const firstEmptyCell = document.querySelector('.cell:not(.has-value, .solved-cell)');
    const lastCell = this.puzzleContainer.lastElementChild;
    let activeCell = firstEmptyCell ?? lastCell;
    const crosswordSubmitBtn = document.getElementById('crossword-submit-btn');
    const allCellsComplete = () => this.guessedLetters.length === winningWord.length;

    if (this.isLetter(input) && !allCellsComplete()) {
      // Add letter to cell
      this.updateLetter(activeCell, input);
      if (allCellsComplete()) { crosswordSubmitBtn.disabled = false; }
    } else if (input === 'Backspace') {
      // If cell is not first or is not empty, reassign active cell to the cell preceding it
      // Remove letter from cell
      activeCell = activeCell.id === 'cell-0' || activeCell.classList.contains('has-value') ? activeCell : activeCell.previousElementSibling;
      this.updateLetter(activeCell); 
      crosswordSubmitBtn.disabled = true;
    } else if (input === 'Enter' && allCellsComplete()) {
      // Check if winner
      const isWinner = this.guessedLetters.join('') === winningWord;
      const letterDivs = [...this.puzzleContainer.children];
      
      if (isWinner) {
        this.bounceAnimation(letterDivs);
        letterDivs.forEach(cell => cell.classList.add('solved-cell'))
        this.showPuzzleResult() 
      } else {
        this.shakeAnimation(letterDivs);

        // decrement mistakes counter
        const dot = this.crosswordMistakesContainer.querySelector('.dot');
        this.crosswordMistakesContainer.removeChild(dot);
        this.crosswordMistakesRemaining -= 1;

        if (this.crosswordMistakesRemaining === 0) { this.showPuzzleResult(false); } 
      }  
      crosswordSubmitBtn.disabled = true;
    }
  }

  isLetter(input) {
    return input.match(/[a-z]/i) && input.length === 1;
  }

  // Change letter value and add or remove from guessedLetters
  updateLetter(letter, value = '') {
    letter.innerHTML = value;

    if (!value) {
      letter.classList.remove('has-value');
      this.guessedLetters.pop();
    } else {
      letter.classList.add('has-value');
      this.guessedLetters.push(value);
    }
  }

  // Return true if categoryNames for all cards are the same
  allCategoriesMatch() {
    const firstCategory = this.selectedCards[0].categoryName;

    if (this.selectedCards.every(card => card.categoryName === firstCategory)) {
      return firstCategory;
    }
  }

  

  showPuzzleResult(isWinner = true) {
    const puzzleType = this.currentCard.wordle ? 'wordle' : 'crossword';
    const message = isWinner ? `You solved this ${puzzleType} puzzle!` : `The correct word is ${this.currentCard.wordValue}.`;

    this.updateCardPuzzleResult(isWinner);
    this.puzzleMessage.innerHTML = message;
    this.showElement(this.puzzleMessage, this.closePuzzleBtn);
    this.crosswordSubmitBtn.disabled = true;
    this.puzzlesRemaining -= 1;

    if (this.puzzlesRemaining === 0) {
      this.subHeading.innerHTML = 'Now, create four groups of four!'
    }
  }

  // Set Card values for board view
  updateCardPuzzleResult(isWinner) {
    this.currentCard.cardSolved = isWinner;
    this.currentCard.puzzlePlayed = true;
    this.currentCard.letters = this.currentCard.winningLetters();
  }

  resetPuzzle() {
    const currentPuzzle = this.puzzleModal.classList.contains('wordle-puzzle') ? 'wordle' : 'crossword';
    const puzzleContent = [this.puzzleMessage, this.crosswordClue, this.crosswordMistakesContainer]
    const puzzleDivs = [this.puzzleMessage, this.closePuzzleBtn, this.puzzleModal]

    // Reset puzzle content
    puzzleContent.forEach(element => element.innerHTML = '');
    this.crosswordMistakesRemaining = 4;
    this.guessedLetters = [];

    // Hide puzzle divs
    this.puzzleModal.classList.remove(`${currentPuzzle}-puzzle`);
    puzzleDivs.forEach(div => this.hideElement(div));
  }

  resetSelectedCards() {
    const selectedCardDivs = [...document.getElementsByClassName('selected')];

    selectedCardDivs.forEach(card => card.classList.remove('selected'));

    this.selectedCards = [];
  }

  init() {
    this.renderDeck();
    this.bindEvents();
  }

  constructor() {
    this.data = GAME_DATA[0];
    this.deck = this.createDeck();
    this.registerTemplates();

    // Connections game
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
    this.guessedLetters = [];
    this.crosswordMistakesRemaining = 4;
    this.puzzleModal = document.getElementById('puzzle-modal');
    this.puzzleTitle = document.getElementById('puzzle-title');
    this.puzzleContainer = document.getElementById('puzzle-container');
    this.puzzleMessage = document.getElementById('puzzle-message');
    this.closePuzzleBtn = document.getElementById('close-puzzle-btn');
    this.crosswordClue = document.getElementById('crossword-clue');
    this.crosswordMistakesContainer = document.getElementById('crossword-mistakes-container');
    this.crosswordSubmitBtn = document.getElementById('crossword-submit-btn');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const myGame = new Game;
  myGame.init();
})

