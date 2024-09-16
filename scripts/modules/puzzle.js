import { bounceAnimation, shakeAnimation } from "./animations.js";

class Puzzle {
  constructor(type, word) {
    this.type = type;
    this.letters = word.split('');
    this.puzzlePlayed = this.type === 'none';
    this.puzzleSolved = false;
    this.guessedLetters = [];
    this.guessedWords = [];
    this.bounceAnimation = bounceAnimation;
    this.shakeAnimation = shakeAnimation;
  }

  getMove(input) {
    const allSquaresFilled = this.allSquaresFilled();

    if (this.isLetter(input) && !allSquaresFilled) {
      return 'addLetter';
    } else if (input === 'Backspace') {
      return 'deleteLetter';
    } else if (input === 'Enter' && allSquaresFilled) {
      return 'checkGuess';
    }
  }

  allSquaresFilled() {
    return this.guessedLetters.length === this.letters.length;;
  }

  isLetter(input) {
    return input.length === 1 && input.match(/[a-z]/i);
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

  isUniqueGuess(word) {
    return !this.guessedWords.includes(word);
  }

  addToGuessedWords(word) {
    this.guessedWords.push(word);
  }

  isWinner(word) {
    return word === this.letters.join('');
  }

  showPuzzleMessage(message, flashMessage = false) {
    const puzzleMessage = document.getElementById('puzzle-message');
    puzzleMessage.innerHTML = message;
    puzzleMessage.classList.remove('hide');

    // Hide message after 1.2 seconds
    if (flashMessage) { setTimeout(() => puzzleMessage.classList.add('hide'), 1200) }
  }

  setPuzzleSolved(isSolved = true) {
    this.puzzlePlayed = true;
    this.puzzleSolved = isSolved;
  }
}

export { Puzzle };