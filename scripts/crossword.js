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
      if (this.rowIsComplete()) { crosswordSubmitBtn.disabled = false; }
    } else if (move === 'deleteLetter') {
      activeCell = this.getPrevious(activeCell);
      this.updateLetter(activeCell); 
      crosswordSubmitBtn.disabled = true;
    } else if (move === 'checkRow') {
      this.checkGuess();
    }
  }

  checkGuess() {
    const puzzleContainer = document.getElementById('puzzle-container');
    const crosswordSubmitBtn = document.getElementById('crossword-submit-btn');
    const isWinningGuess = this.isWinner();
    // const letterDivs = [...this.puzzleContainer.children];
    const letterDivs = [...puzzleContainer.children];

    if (isWinningGuess) {
      bounceAnimation(letterDivs);
      this.styleResults(letterDivs);
      this.showPuzzleResultMessage();
      this.setPuzzleSolved();
    } else {
      shakeAnimation(letterDivs);
      this.decrementCrosswordMistakes();

      if (this.crosswordMistakesRemaining === 0) { 
        this.showPuzzleResultMessage(false);
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

  showPuzzleResultMessage(isWinner = true) {
    super.showPuzzleResultMessage(isWinner);

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