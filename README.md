# Word Salad

Word Salad is The New York Times Connections, Crossword, and Wordle games...all at the same time.

![Game board](/images/game-board.png)

# How to Play

The game board is comprised of 16 cards. Some of the cards already have words on them. Some of the cards contain a puzzle that you'll need to solve before you can reveal the word.

1. Solve the puzzles on the blank cards to reveal the words.
2. After all the words have been revealed, find the four categories of four words that share something in common.

## Installation

Open the index.html file in the browser.

## Notes for Emily

Thank you for reviewing my work! I know this takes a long time and is actual work, and I appreciate any level of review that you have time for, whether it's some high-level notes or more granular feedback.

One thing I would love advice on is best practices on how to structure my code. Should certain things be moved to a separate file (e.g. Handlebars templates)? Should I organize my classes differently?

Known issues:
- There is data for only 1 game right now. I just wanted to get it working first, but I may add more games in the future.
- The close button is difficult to click
- You can currently submit words that don't actually exist in the dictionary
- You can submit words/categories that you've already submitted
- The crossword...is not actually a crossword. (Still deciding how complex I want to get with this.)
- Animations don't match the real NYT animations exactly

## Answer Key

```
CORE

[CRUX, ESSENCE, HEART, SUBSTANCE]
```

```
COMPLICATED

[BAROQUE, COMPLEX, ELABORATE, MESSY]
```

```
SYMBOLS USED IN MAKING LISTS

[ARROW, BULLET, CHECKBOX, HYPHEN]
```

```
WHAT 'CROSS' MIGHT MEAN

[ANGRY, BETRAY, CRUCIFIX, HYBRID]
```

## Todos
_Emily: These are my WIP notes! Feel free to ignore! (Or not!)_
```
MVP:
- Make close puzzle button div easier to click

- Show score at the end of game:
  - Number of wordles solved
  - Number of crosswords solved
  - Number of categories found

- Clean up templates
  - Card properties to remove: noPuzzle, wordle, and crossword
  - Card property to add: puzzleType (string, possible values: 'none', 'wordle', 'crossword')
  - Update Handlebars template to reference new puzzleType property

Potential V2 updates:
- Add additional game data
- Games database?
- Puzzles
  - User can close incomplete puzzle
  - User can reopen incomplete puzzle and previous state is saved
  - User can only submit real words that exist in dictionary
  - User can't submit the same word twice
- Crossword is more-crossword like
  - Make actual mini crossword? (harder)
  - Allow letter hints (easier) 
  - Add instructions
- Wordle
  - Add keyboard? (not sure if this is necessary on desktop)
  - Add instructions
- Connections
  - When showing all categories, categories should be sorted with the ones the user found first, then by difficulty
  - Add instructions
- Make Puzzle class and extract some of the game play functions into this?  
- More robust animations
```
