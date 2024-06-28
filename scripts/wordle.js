class Wordle extends Puzzle {
  constructor(word) {
    super('wordle', word);
  }

  playPuzzle(input) {
    const move = this.getMove(input);
    const row = document.querySelector('.incomplete-row');
    let activeTile = document.querySelector('.tile:not(.has-value)');

    if (move === 'addLetter') {
      this.updateLetter(activeTile, input);
    } else if (move === 'deleteLetter') {
      this.updateLetter(this.getPrevious(activeTile, row));
    } else if (move === 'checkRow') {
      this.checkGuess(row);
    }
  }

  checkGuess(row) {
    const results = this.checkLetters();

    this.styleResults(results, row);
    this.guessedLetters = [];

    // Show result if winning guess or last row
    const isWinningGuess = this.isWinner(results);
    const isLastRow = row.id === 'row-5';

    if (isWinningGuess) { 
      bounceAnimation([...row.children]);
      this.showPuzzleResultMessage();     
      this.setPuzzleSolved();
    } else if (isLastRow) {
      this.showPuzzleResultMessage(false);
      this.setPuzzleSolved(false);
    }
  }

  // Return the last wordle tile with a letter that hasn't been submitted yet
  getPrevious(activeTile, row) {
    const isFirstTile = row.firstElementChild === activeTile;

    if (this.rowIsComplete()) {
      return row.lastElementChild;
    } else if (!isFirstTile) {
      return activeTile.previousElementSibling;
    } else {
      return activeTile;
    }
  }

  // Return array of results for each guessed letter
  checkLetters() {
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

  isWinner(results) {
    return results.every(result => result === 'correct');
  }

  // Change tile color to green, yellow, or gray
  styleResults(results, row) {
    const tiles = row.children;

    results.forEach((status, idx) => tiles[idx].classList.add(status));
    row.classList.remove('incomplete-row');
  }
}