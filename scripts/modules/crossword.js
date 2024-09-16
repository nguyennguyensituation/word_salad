import { Puzzle } from "./puzzle.js";
import { bounceAnimation, shakeAnimation } from "./animations.js";

class Crossword extends Puzzle {
  constructor(word, crosswordClue) {
    super('crossword', word);
    this.crosswordClue = crosswordClue;
    this.crosswordMistakesRemaining = 4;
  }

  playPuzzle(input) {
    const move = this.getMove(input);
    let activeSquare = this.getActiveSquare(move);
    
    if (move === 'addLetter') {
      this.updateLetter(activeSquare, input);
      if (this.allSquaresFilled()) { this.submitBtnDisplay('show') }
    } else if (move === 'deleteLetter') {
      this.updateLetter(activeSquare); 
      this.submitBtnDisplay('hide');
    } else if (move === 'checkGuess') {
      const word = this.guessedLetters.join('');

      if (this.isUniqueGuess(word)) {
        this.checkGuess();
      } else {
        const message = "You already guessed that word!";

        this.showPuzzleMessage(message, true);
        this.submitBtnDisplay('hide');
      }
    }
  }

  getActiveSquare(move) {
    const firstEmptyCell = document.querySelector('.cell:not(.has-value, .solved-cell)');
    const lastCell = document.getElementById('puzzle-container').lastElementChild;
    let square = firstEmptyCell ?? lastCell;

    if (move === 'deleteLetter') {
      return this.getPrevious(square);
    }

    return square;
  }

  getPrevious(square) {
    const isFirstSquare = square.id === 'cell-0';
    const hasLetter = square.classList.contains('has-value');

    return isFirstSquare || hasLetter ? square : square.previousElementSibling;
  }

  checkGuess() {
    const puzzleContainer = document.getElementById('puzzle-container');
    const word = this.guessedLetters.join('');
    const isWinningGuess = this.isWinner(word);
    const letterDivs = [...puzzleContainer.children];
    
    this.addToGuessedWords(word);

    if (isWinningGuess) {
      bounceAnimation(letterDivs);
      this.styleResults(letterDivs);
      this.showPuzzleMessage(`You solved this ${this.type} puzzle!`);
      this.setPuzzleSolved();
    } else {
      shakeAnimation(letterDivs);
      this.decrementCrosswordMistakes();

      if (this.crosswordMistakesRemaining === 0) { 
        this.showPuzzleMessage(`The correct word is ${this.letters.join('').toUpperCase()}.`);
        this.setPuzzleSolved(false);
      }  
    }

    this.submitBtnDisplay('hide');
  }

  decrementCrosswordMistakes() {
    const crosswordMistakesContainer = document.getElementById('crossword-mistakes-container');
    const dot = crosswordMistakesContainer.querySelector('.dot');
    
    crosswordMistakesContainer.removeChild(dot);
    this.crosswordMistakesRemaining -= 1;
  }

  submitBtnDisplay(mode) {
    const crosswordSubmitBtn = document.getElementById('crossword-submit-btn');

    crosswordSubmitBtn.disabled = mode === 'hide';
  }

  // Change square background color
  styleResults(squares) {
    squares.forEach(square => square.classList.add('solved-cell'));
  }
}

export { Crossword };