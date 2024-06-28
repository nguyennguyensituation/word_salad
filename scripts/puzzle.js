class Puzzle {
  constructor(type, word) {
    this.type = type;
    this.letters = word.toLowerCase().split('');
    this.guessedLetters = [];
    this.puzzlePlayed = this.type === 'none';
    this.puzzleSolved = false;
    this.puzzleModal = document.getElementById('puzzle-modal');
    this.puzzleContainer = document.getElementById('puzzle-container');
    this.closePuzzleBtn = document.getElementById('close-puzzle-btn');
  }

  getMove(input) {
    const rowIsComplete = this.rowIsComplete();

    if (this.isLetter(input) && !rowIsComplete) {
      return 'addLetter';
    } else if (input === 'Backspace') {
      return 'deleteLetter';
    } else if (input === 'Enter' && rowIsComplete) {
      return 'checkRow';
    }
  }

  rowIsComplete() {
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
