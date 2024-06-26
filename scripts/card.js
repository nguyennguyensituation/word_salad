class Card {
  constructor(id, categoryName, wordData) {
    this.id = id;
    this.categoryName = categoryName;
    this.wordValue = wordData.wordValue;
    this.letters =  wordData.miniPuzzle === 'none' ? null : this.blankSpaces();
    this.cardSolved = wordData.miniPuzzle === 'none';
    this.puzzle = new Puzzle(wordData);
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
