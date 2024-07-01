class Crossword extends Puzzle {
  constructor(word, crosswordClue) {
    super('crossword', word);
    this.crosswordClue = crosswordClue;
    this.crosswordMistakesRemaining = 4;
    this.crosswordMistakesContainer = document.getElementById('crossword-mistakes-container');
  }

  playPuzzle(input) {
    const move = this.getMove(input);
    const firstEmptyCell = document.querySelector('.cell:not(.has-value, .solved-cell)');
    const lastCell = document.getElementById('puzzle-container').lastElementChild;
    let activeCell = firstEmptyCell ?? lastCell;
    const crosswordSubmitBtn = document.getElementById('crossword-submit-btn');
   
    if (move === 'addLetter') {
      this.updateLetter(activeCell, input);
      if (this.allSquaresFilled()) { crosswordSubmitBtn.disabled = false; }
    } else if (move === 'deleteLetter') {
      activeCell = this.getPrevious(activeCell);
      this.updateLetter(activeCell); 
      crosswordSubmitBtn.disabled = true;
    } else if (move === 'checkRow') {
      const word = this.guessedLetters.join('');

      if (this.isUniqueGuess(word)) {
        this.checkGuess();
      } else {
        const message = "You already guessed that word!";

        this.showPuzzleMessage(message, true)
      }
    }
  }

  checkGuess() {
    const puzzleContainer = document.getElementById('puzzle-container');
    const crosswordSubmitBtn = document.getElementById('crossword-submit-btn');
    const isWinningGuess = this.isWinner();
    const letterDivs = [...puzzleContainer.children];
    
    this.addWordToGuessedWordsArray();

    if (isWinningGuess) {
      bounceAnimation(letterDivs);
      this.styleResults(letterDivs);
      this.showPuzzleMessage(`You solved this ${this.type} puzzle!`);
      this.disableSubmitBtn() 
      this.setPuzzleSolved();
    } else {
      shakeAnimation(letterDivs);
      this.decrementCrosswordMistakes();

      if (this.crosswordMistakesRemaining === 0) { 
        this.showPuzzleMessage(`The correct word is ${this.letters.join('').toUpperCase()}.`);
        this.disableSubmitBtn() 
        this.setPuzzleSolved(false);
      }  

      crosswordSubmitBtn.disabled = true;
    }
  }

  getPrevious(activeCell) {
    if (activeCell.id === 'cell-0' || activeCell.classList.contains('has-value')) { 
      return activeCell 
    } else {
      return activeCell.previousElementSibling;
    } 
  }

  isWinner() {
    return this.guessedLetters.join('') === this.letters.join('');
  }

  disableSubmitBtn() {
    const crosswordSubmitBtn = document.getElementById('crossword-submit-btn');
    crosswordSubmitBtn.disabled = true;
  }

  decrementCrosswordMistakes() {
    const crosswordMistakesContainer = document.getElementById('crossword-mistakes-container');
    const dot = crosswordMistakesContainer.querySelector('.dot');
    
    crosswordMistakesContainer.removeChild(dot);
    this.crosswordMistakesRemaining -= 1;
  }

  // Change cell color to blue
  styleResults(cells) {
    cells.forEach(cell => cell.classList.add('solved-cell'));
  }
}