const GAME_DATA = [
  {
    id: 1,
    categories: [
      {
        difficulty: 1,
        categoryName: "core",
        categoryWords: [
          { wordValue: 'crux', miniPuzzle: 'crossword', crosswordClue: "Gist"},
          { wordValue: 'essence', miniPuzzle: 'none'},
          { wordValue: 'heart', miniPuzzle: 'wordle' },
          { wordValue: 'substance', miniPuzzle: 'none'},
        ]
      },
      {
        difficulty: 2,
        categoryName: "complicated",
        categoryWords: [
          { wordValue: 'baroque', miniPuzzle: 'crossword', crosswordClue: "Music style popularized by Bach" },
          { wordValue: 'complex', miniPuzzle: 'none'},
          { wordValue: 'elaborate', miniPuzzle: 'none'},
          { wordValue: 'messy', miniPuzzle: 'wordle'},
        ]
      },
      {
        difficulty: 3,
        categoryName: "symbols used in making lists",
        categoryWords: [
          { wordValue: 'arrow', miniPuzzle: 'wordle'},
          { wordValue: 'bullet', miniPuzzle: 'crossword', crosswordClue: "Muggsy Bogues or Manute Bol, once" },
          { wordValue: 'checkbox', miniPuzzle: 'none' },
          { wordValue: 'hyphen', miniPuzzle: 'none' },
        ]
      },
      {
        difficulty: 4,
        categoryName: "what 'cross' might mean",
        categoryWords: [
          { wordValue: 'angry', miniPuzzle: 'wordle'},
          { wordValue: 'betray', miniPuzzle: 'none'},
          { wordValue: 'crucifix', miniPuzzle: 'crossword', crosswordClue: "One of those 'T' necklaces, maybe" },
          { wordValue: 'hybrid', miniPuzzle: 'none'},
        ]
      },
    ]
  },
  {
    id: 2,
    categories: [
      {
        difficulty: 1,
        categoryName: "latin words",
        categoryWords: [
          { wordValue: 'carpe', miniPuzzle: 'wordle'},
          { wordValue: 'ergo', miniPuzzle: 'none' },
          { wordValue: 'quid', miniPuzzle: 'crossword', crosswordClue: "A pound across the pond, perhaps" },
          { wordValue: 'vox', miniPuzzle: 'none'},
        ]
      },
      {
        difficulty: 2,
        categoryName: "pack (away) for future use",
        categoryWords: [
          { wordValue: 'squirrel', miniPuzzle: 'crossword', crosswordClue: "____ Nut Zippers" },
          { wordValue: 'stash', miniPuzzle: 'none'},
          { wordValue: 'store', miniPuzzle: 'wordle'},
          { wordValue: 'stow', miniPuzzle: 'none'},
        ]
      },
      {
        difficulty: 3,
        categoryName: "_____ game",
        categoryWords: [
          { wordValue: 'arcade', miniPuzzle: 'crossword', crosswordClue: "Where you might find Ms. Pac-Man"},
          { wordValue: 'blame', miniPuzzle: 'none' },
          { wordValue: 'numbers', miniPuzzle: 'none' },
          { wordValue: 'squid', miniPuzzle: 'wordle' },
        ]
      },
      {
        difficulty: 4,
        categoryName: "adjectives for assets",
        categoryWords: [
          { wordValue: 'fixed', miniPuzzle: 'none' },
          { wordValue: 'frozen', miniPuzzle: 'crossword', crosswordClue: "Ice cold" },
          { wordValue: 'liquid', miniPuzzle: 'none' },
          { wordValue: 'toxic', miniPuzzle: 'wordle'},
        ]
      },
    ]
  },
  {
    id: 3,
    categories: [
      {
        difficulty: 1,
        categoryName: "highly skilled",
        categoryWords: [
          { wordValue: 'ace', miniPuzzle: 'crossword', crosswordClue: "Part of a winning pair in blackjack"},
          { wordValue: 'maestro', miniPuzzle: 'none'},
          { wordValue: 'adept', miniPuzzle: 'wordle' },
          { wordValue: 'hotshot', miniPuzzle: 'none'},
        ]
      },
      {
        difficulty: 2,
        categoryName: "kinds of cake",
        categoryWords: [
          { wordValue: 'birthday', miniPuzzle: 'none' },
          { wordValue: 'crumb', miniPuzzle: 'crossword', crosswordClue: "The soft part of bread"},
          { wordValue: 'marble', miniPuzzle: 'none'},
          { wordValue: 'pound', miniPuzzle: 'wordle'},
        ]
      },
      {
        difficulty: 3,
        categoryName: "tangible",
        categoryWords: [
          { wordValue: 'concrete', miniPuzzle: 'none' },
          { wordValue: 'material', miniPuzzle: 'crossword', crosswordClue: "Half of a moniker for Madonna"},
          { wordValue: 'real', miniPuzzle: 'none' },
          { wordValue: 'solid', miniPuzzle: 'wordle' },
        ]
      },
      {
        difficulty: 4,
        categoryName: "things you can throw in metaphors",
        categoryWords: [
          { wordValue: 'curveball', miniPuzzle: 'none' },
          { wordValue: 'party', miniPuzzle: 'wordle' },
          { wordValue: 'tantrum', miniPuzzle: 'none' },
          { wordValue: 'wrench', miniPuzzle: 'crossword', crosswordClue: "To pull or twist"},
        ]
      },
    ]
  },
  {
    id: 4,
    categories: [
      {
        difficulty: 1,
        categoryName: "get excited, with 'up'",
        categoryWords: [
          { wordValue: 'fire', miniPuzzle: 'crossword', crosswordClue: "Earth wind and ____"},
          { wordValue: 'hype', miniPuzzle: 'none'},
          { wordValue: 'psych', miniPuzzle: 'wordle' },
          { wordValue: 'amp', miniPuzzle: 'none'},
        ]
      },
      {
        difficulty: 2,
        categoryName: "kinds of shoes",
        categoryWords: [
          { wordValue: 'pump', miniPuzzle: 'none' },
          { wordValue: 'flat', miniPuzzle: 'crossword', crosswordClue: "A tire might get this"},
          { wordValue: 'mule', miniPuzzle: 'none'},
          { wordValue: 'slide', miniPuzzle: 'wordle'},
        ]
      },
      {
        difficulty: 3,
        categoryName: "legislative roles",
        categoryWords: [
          { wordValue: 'speaker', miniPuzzle: 'none' },
          { wordValue: 'whip', miniPuzzle: 'crossword', crosswordClue: "Part of a lion tamer's constume"},
          { wordValue: 'leader', miniPuzzle: 'none' },
          { wordValue: 'chair', miniPuzzle: 'wordle' },
        ]
      },
      {
        difficulty: 4,
        categoryName: "name homophones",
        categoryWords: [
          { wordValue: 'mic', miniPuzzle: 'none' },
          { wordValue: 'matte', miniPuzzle: 'wordle' },
          { wordValue: 'dug', miniPuzzle: 'none' },
          { wordValue: 'peat', miniPuzzle: 'crossword', crosswordClue: "Basketball suffix with 'three'"},
        ]
      },
    ]
  },
  {
    id: 5,
    categories: [
      {
        difficulty: 1,
        categoryName: "reside",
        categoryWords: [
          { wordValue: 'stay', miniPuzzle: 'crossword', crosswordClue: "Lisa Loeb song"},
          { wordValue: 'inhabit', miniPuzzle: 'none'},
          { wordValue: 'dwell', miniPuzzle: 'wordle' },
          { wordValue: 'live', miniPuzzle: 'none'},
        ]
      },
      {
        difficulty: 2,
        categoryName: "decrease",
        categoryWords: [
          { wordValue: 'dwindle', miniPuzzle: 'none' },
          { wordValue: 'drop', miniPuzzle: 'crossword', crosswordClue: "What you might do to a hot potato"},
          { wordValue: 'decline', miniPuzzle: 'none'},
          { wordValue: 'abate', miniPuzzle: 'wordle'},
        ]
      },
      {
        difficulty: 3,
        categoryName: "doofus",
        categoryWords: [
          { wordValue: 'sap', miniPuzzle: 'none' },
          { wordValue: 'dweeb', miniPuzzle: 'crossword', crosswordClue: "A nerdy type"},
          { wordValue: 'turkey', miniPuzzle: 'none' },
          { wordValue: 'clown', miniPuzzle: 'wordle' },
        ]
      },
      {
        difficulty: 4,
        categoryName: "member of a septet",
        categoryWords: [
          { wordValue: 'sea', miniPuzzle: 'none' },
          { wordValue: 'dwarf', miniPuzzle: 'wordle' },
          { wordValue: 'sin', miniPuzzle: 'none' },
          { wordValue: 'wonder', miniPuzzle: 'crossword', crosswordClue: "He just called to say, 'I love you'"},
        ]
      },
    ]
  },
  {
    id: 6,
    categories: [
      {
        difficulty: 1,
        categoryName: "vitality",
        categoryWords: [
          { wordValue: 'life', miniPuzzle: 'crossword', crosswordClue: "Board game or cereal, perhaps"},
          { wordValue: 'energy', miniPuzzle: 'none'},
          { wordValue: 'juice', miniPuzzle: 'wordle' },
          { wordValue: 'zip', miniPuzzle: 'none'},
        ]
      },
      {
        difficulty: 2,
        categoryName: "palindromes featuring 'e'",
        categoryWords: [
          { wordValue: 'pep', miniPuzzle: 'none' },
          { wordValue: 'tenet', miniPuzzle: 'crossword', crosswordClue: "Christopher Nolan movie"},
          { wordValue: 'refer', miniPuzzle: 'none'},
          { wordValue: 'level', miniPuzzle: 'wordle'},
        ]
      },
      {
        difficulty: 3,
        categoryName: "featured in 'jack and the beanstalk'",
        categoryWords: [
          { wordValue: 'cow', miniPuzzle: 'none' },
          { wordValue: 'giant', miniPuzzle: 'crossword', crosswordClue: "Enormous"},
          { wordValue: 'jack', miniPuzzle: 'none' },
          { wordValue: 'beans', miniPuzzle: 'wordle' },
        ]
      },
      {
        difficulty: 4,
        categoryName: "car models",
        categoryWords: [
          { wordValue: 'volt', miniPuzzle: 'none' },
          { wordValue: 'civic', miniPuzzle: 'wordle' },
          { wordValue: 'focus', miniPuzzle: 'none' },
          { wordValue: 'beetle', miniPuzzle: 'crossword', crosswordClue: "A ladybug is a type of this"},
        ]
      },
    ]
  },
]

export { GAME_DATA };