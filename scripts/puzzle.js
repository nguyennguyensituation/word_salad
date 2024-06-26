class Puzzle {
  constructor(wordData) {
    this.type = wordData.miniPuzzle;
    this.letters = wordData.wordValue.split('');
    this.crosswordClue = wordData.crosswordClue || '';
    this.puzzlePlayed = this.type === 'none';
  }
}