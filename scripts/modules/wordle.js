import { Puzzle } from "./puzzle.js";
import { VALID_WORDLE_WORDS } from "./wordle_dictionary.js";
import { tileFlipAnimation } from "./animations.js";

class Wordle extends Puzzle {
  constructor(word) {
    super('wordle', word);
  }

  playPuzzle(input) {
    const move = this.getMove(input);
    const row = document.querySelector('.incomplete-row');
    const activeSquare =  this.getActiveSquare(move);

    if (move === 'addLetter') {
      this.updateLetter(activeSquare, input);
    } else if (move === 'deleteLetter') {
      this.updateLetter(activeSquare);
    } else if (move === 'checkGuess') {
      const word = this.guessedLetters.join('');

      if (this.isValidWordleWord(word) && this.isUniqueGuess(word)) {
        this.checkGuess(row);
      } else {
        const message = this.isUniqueGuess(word) ? "That word isn't in the word list." : "You already guessed that word!";

        this.shakeAnimation([...row.children]);
        this.showPuzzleMessage(message, true)
      }
    }
  }

  getActiveSquare(move) {
    let square = document.querySelector('.tile:not(.has-value)');

    if (move === 'deleteLetter') {
      const row = document.querySelector('.incomplete-row');

      return this.getPrevious(square, row)
    }

    return square;
  }

  getPrevious(square, row) {
    const isNotFirstSquare = row.firstElementChild !== square;

    if (this.allSquaresFilled()) {
      return row.lastElementChild;
    } else if (isNotFirstSquare) {
      return square.previousElementSibling;
    } else {
      return square;
    }
  }

  isValidWordleWord(word) {
    let left = 0;
    let right = VALID_WORDLE_WORDS.length - 1;

    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      if (VALID_WORDLE_WORDS[mid] === word) {
        return true;
      } else if (VALID_WORDLE_WORDS[mid] < word) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return false;
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

  checkGuess(row) {
    const results = this.checkLetters();
    const word = this.guessedLetters.join('');

    this.styleResults(results, row);
    this.addToGuessedWords(word);
    this.guessedLetters = [];

    // Show result if winning guess or last row
    const isWinningGuess = this.isWinner(word);
    const isLastRow = row.id === 'row-5';

    if (isWinningGuess) { 
      this.setPuzzleSolved();
      setTimeout(() => { 
        this.bounceAnimation([...row.children]);
        this.showPuzzleMessage(`You solved this Wordle!`);
      }, 3250);
    } else if (isLastRow) {
      this.setPuzzleSolved(false);
      setTimeout(() => { 
        this.showPuzzleMessage(`The correct word is ${this.letters.join('').toUpperCase()}.`);
      }, 3250); 
    }
  }

  // Change square background color
  styleResults(results, row) {
    const tiles = [...row.children];

    // results.forEach((status, idx) => tiles[idx].classList.add(status));
    tileFlipAnimation(tiles, results) 
    row.classList.remove('incomplete-row');
  }
}

export { Wordle };