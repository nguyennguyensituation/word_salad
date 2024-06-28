class Puzzle {
  constructor(wordData) {
    this.type = wordData.miniPuzzle;
    this.letters = wordData.wordValue.toLowerCase().split('');
    this.guessedLetters = [];
    this.puzzlePlayed = this.type === 'none';
    this.puzzleSolved = false;
    this.puzzleModal = document.getElementById('puzzle-modal');
    this.puzzleContainer = document.getElementById('puzzle-container');
    this.closePuzzleBtn = document.getElementById('close-puzzle-btn');

    if (this.type === 'crossword') {
      this.crosswordClue = wordData.crosswordClue || '';
      this.crosswordMistakesRemaining = 4;
      this.crosswordMistakesContainer = document.getElementById('crossword-mistakes-container');
      this.crosswordSubmitBtn = document.getElementById('crossword-submit-btn');
    }
  }

  playWordle(input) {
    const currentMove = this.getMove(input);
    const row = document.querySelector('.incomplete-row');
    let activeTile = document.querySelector('.tile:not(.has-value)');

    if (currentMove === 'addLetter') {
      this.updateLetter(activeTile, input);
    } else if (currentMove === 'deleteLetter') {
      this.updateLetter(this.getPreviousWordleTile(activeTile, row));
    } else if (currentMove === 'checkRow') {
      const results = this.checkWordleGuess(this.guessedLetters, this.letters);

      this.styleWordleResults(results, row);
      this.guessedLetters = [];

      // Show result if winning row or last row
      const isWinner = results.every(result => result === 'correct');
      const isLastRow = row.id === 'row-5';

      if (isWinner) { 
        this.bounceAnimation([...row.children]);
        this.showPuzzleResult();
        this.puzzlePlayed = true;
        this.puzzleSolved = true;
      } else if (isLastRow) {
        this.showPuzzleResult(false);
        this.puzzlePlayed = true;
      }
    }
  }

  playCrossword(input) {
    const currentMove = this.getMove(input);
    const firstEmptyCell = document.querySelector('.cell:not(.has-value, .solved-cell)');
    const lastCell = document.getElementById('puzzle-container').lastElementChild;
    let activeCell = firstEmptyCell ?? lastCell;
   
    if (currentMove === 'addLetter') {
      this.updateLetter(activeCell, input);
      if (this.rowIsComplete()) { this.crosswordSubmitBtn.disabled = false; }
    } else if (currentMove === 'deleteLetter') {
      activeCell = this.getPreviousCrosswordTile(activeCell);
      this.updateLetter(activeCell); 
      this.crosswordSubmitBtn.disabled = true;
    } else if (currentMove === 'checkRow') {
      const isWinner = this.checkCrosswordGuess();
      const letterDivs = [...this.puzzleContainer.children];
      
      if (isWinner) {
        this.bounceAnimation(letterDivs);
        this.styleCrosswordResults(letterDivs);
        this.showPuzzleResult();
        this.puzzlePlayed = true;
        this.puzzleSolved = true;
      } else {
        this.shakeAnimation(letterDivs);
        this.decrementCrosswordMistakesCounter();

        if (this.crosswordMistakesRemaining === 0) { 
          this.showPuzzleResult(false); } 
          this.puzzlePlayed = true;
      }  
      this.crosswordSubmitBtn.disabled = true;
    }
  }

  getMove(input) {
    const maxRowLength = this.type === 'wordle' ? 5 : this.letters.length;
    const rowIsComplete = this.rowIsComplete();

    if (this.isLetter(input) && !rowIsComplete) {
      return 'addLetter';
    } else if (input === 'Backspace') {
      return 'deleteLetter';
    } else if (input === 'Enter' && rowIsComplete) {
      return 'checkRow';
    }
  }

  isLetter(input) {
    return input.match(/[a-z]/i) && input.length === 1;
  }

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

  // Return the last wordle tile with a letter that hasn't been submitted yet
  getPreviousWordleTile(activeTile, row) {
    const isFirstTile = row.firstElementChild === activeTile;

    if (this.rowIsComplete()) {
      return row.lastElementChild;
    } else if (!isFirstTile) {
      return activeTile.previousElementSibling;
    } else {
      return activeTile;
    }
  }

  getPreviousCrosswordTile(activeCell) {
    if (activeCell.id === 'cell-0' || activeCell.classList.contains('has-value')) {
      return activeCell;
    } else {
      return activeCell.previousElementSibling;
    }
  }

  // Return true if every cell/tile has a letter
  rowIsComplete() {
    return this.guessedLetters.length === this.letters.length;;
  }

  // Return array of results for each guessed letter, accounting for duplicate letters
  checkWordleGuess() {
    let winningLetters = [...this.letters];
    let results = this.guessedLetters.map((letter, idx) => {
      if (letter === winningLetters[idx]) {
        winningLetters[idx] = '';
        return 'correct';
      } else if (!winningLetters.includes(letter)) {
        return 'incorrect-letter';
      } else {
        return 'incorrect-position';
      }
    });

    // Check for duplicate letters
    results.forEach((result, idx) => {
      if (result === 'incorrect-position') {
        if (winningLetters.includes(this.guessedLetters[idx])) {
          const wordIdx = winningLetters.findIndex( letter => letter === this.guessedLetters[idx]);
          winningLetters[wordIdx] = '';
        } else {
          results[idx] = 'incorrect-letter';
        }
      }
    })

    return results;
  }

  // Return true if guessed word is correct
  checkCrosswordGuess() {
    return this.guessedLetters.join('') === this.letters.join('');
  }

  decrementCrosswordMistakesCounter() {
    const dot = this.crosswordMistakesContainer.querySelector('.dot');
    this.crosswordMistakesContainer.removeChild(dot);
    this.crosswordMistakesRemaining -= 1;
  }

  showPuzzleResult(isWinner = true) {
    const puzzleMessage = document.getElementById('puzzle-message');
    const message = isWinner ? `You solved this ${this.type} puzzle!` : `The correct word is ${this.letters.join('').toUpperCase()}.`;

    if (this.type === 'crossword') {
      const crosswordSubmitBtn = document.getElementById('crossword-submit-btn');
      crosswordSubmitBtn.disabled = true;
    }

    puzzleMessage.innerHTML = message;
    puzzleMessage.classList.remove('hide');
  }

  // Change tile color to green, yellow, or gray
  styleWordleResults(results, row) {
    const tiles = row.children;

    results.forEach((status, idx) => tiles[idx].classList.add(status));
    row.classList.remove('incomplete-row');
  }

  // Change cell color to blue
  styleCrosswordResults(cells) {
    cells.forEach(cell => cell.classList.add('solved-cell'));
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
}