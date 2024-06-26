class Card {
  constructor(id, categoryName, wordData) {
    this.id = id;
    this.categoryName = categoryName;
    this.wordValue = wordData.wordValue;
    this.noPuzzle = wordData.miniPuzzle === 'none';
    this.wordle = wordData.miniPuzzle === 'wordle';
    this.crossword = wordData.miniPuzzle === 'crossword';
    this.crosswordClue = wordData.crosswordClue;
    this.letters = this.noPuzzle ? null : this.blankSpaces() ;
    this.cardSolved = this.noPuzzle;
    this.puzzlePlayed = this.noPuzzle;
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
