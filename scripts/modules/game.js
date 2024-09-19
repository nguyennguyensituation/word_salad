import { Card } from "./card.js";

class Game {
  constructor(data) {
    this.deck = this.createDeck(data);
    this.currentCard;
    this.selectedCards = [];
    this.guessedCards = [];
    this.solvedCategories = [];
    this.mistakesRemaining = 4;
    this.puzzlesRemaining = 8;
  }
   // Create array of Card objects
   createDeck(data) {
    let deck = [];
    let id = 0;

    data.categories.forEach(category => {
      category.categoryWords.forEach(word => {
        deck.push(new Card(id, category.categoryName, word));
        id += 1;
      })
    })

    return this.shuffle(deck)
  }

  shuffle(deck) {
    return deck.sort(() => 0.5 - Math.random());
  }

  getCardById(id) {
    return this.deck.find(card => card.id === id);
  }

  selectCard() {
    const card = this.currentCard;
    const isSelectable = this.selectedCards.length < 4 && !card.selected;

    if (isSelectable) {
      card.selected = true;
      this.selectedCards.push(card);
    } else {
      card.selected = false;
      this.selectedCards = this.selectedCards.filter(selectedCard => selectedCard !== card);
    }
  }

  isDuplicateGuess() {
    const selectedCards = this.selectedCards;

    return this.guessedCards.some(previousGuess => this.isDuplicateSelection(selectedCards, previousGuess));
  }

  isDuplicateSelection(currentSelection, previousSelection) {
    return currentSelection.every(card => previousSelection.includes(card));
  }

  resetSelectedCards() {
    this.selectedCards.forEach(card => card.selected = false);
    this.selectedCards = [];
  }

  selectedCategories() {
    let categories = this.selectedCards.map(card => card.categoryName);

    return [...new Set(categories)]
  }
}

export { Game };