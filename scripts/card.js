class Card {
  constructor(id, categoryName, wordData) {
    this.id = id;
    this.categoryName = categoryName;
    this.wordValue = wordData.wordValue;
    this.letters =  wordData.miniPuzzle === 'none' ? null : this.blankSpaces();
    this.cardSolved = wordData.miniPuzzle === 'none';
    // this.puzzle = new Puzzle(wordData);
    this.puzzle = this.createPuzzleObject(wordData.miniPuzzle, wordData.wordValue, wordData.crosswordClue);
    this.selected = false;
  }

  createPuzzleObject(type, word, crosswordClue) {
    if (type === 'crossword') {
      return new Crossword(word, crosswordClue);
    } else if (type === 'wordle') {
      return new Wordle(word);
    }else {
      return new Puzzle(type, word);
    }
  }

  // Return string of empty spaces for puzzle default value
  blankSpaces() {
    return this.wordValue.replace(/./g, ' ').split('');
  }  
  
  // Return array of all letters in word
  winningLetters() {
    return this.wordValue.toLowerCase().split('');
  }
}
