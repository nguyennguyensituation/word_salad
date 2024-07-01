class Puzzle {
  constructor(type, word) {
    this.type = type;
    this.letters = word.split('');
    this.guessedLetters = [];
    this.puzzlePlayed = this.type === 'none';
    this.puzzleSolved = false;
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

  showPuzzleResultMessage(isWinner = true) {
    const puzzleMessage = document.getElementById('puzzle-message');
    const message = isWinner ? `You solved this ${this.type} puzzle!` : `The correct word is ${this.letters.join('').toUpperCase()}.`;

    puzzleMessage.innerHTML = message;
    puzzleMessage.classList.remove('hide');
  }

  setPuzzleSolved(isSolved = true) {
    this.puzzlePlayed = true;
    this.puzzleSolved = isSolved;
  }
}
