class Puzzle {
  constructor(type, word) {
    this.type = type;
    this.letters = word.split('');
    this.guessedLetters = [];
    this.puzzlePlayed = this.type === 'none';
    this.puzzleSolved = false;
    this.guessedWords = [];
  }

  getMove(input) {
    const allSquaresFilled = this.allSquaresFilled();

    if (this.isLetter(input) && !allSquaresFilled) {
      return 'addLetter';
    } else if (input === 'Backspace') {
      return 'deleteLetter';
    } else if (input === 'Enter' && allSquaresFilled) {
      return 'checkRow';
    }
  }

  allSquaresFilled() {
    return this.guessedLetters.length === this.letters.length;;
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

  addWordToGuessedWordsArray() {
    const guessedWord = this.guessedLetters.join('');
    this.guessedWords.push(guessedWord);
  }

  isUniqueGuess(word) {
    return !this.guessedWords.includes(word);
  }

  showPuzzleMessage(message, flashMessage = false) {
    const puzzleMessage = document.getElementById('puzzle-message');
    puzzleMessage.innerHTML = message;
    puzzleMessage.classList.remove('hide');

    // Hides puzzle message after 1.2 seconds
    if (flashMessage) {
      setTimeout(() => {
        puzzleMessage.classList.add('hide');
      }, 1200)
    }
  }

  setPuzzleSolved(isSolved = true) {
    this.puzzlePlayed = true;
    this.puzzleSolved = isSolved;
  }
}
