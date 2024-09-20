function bounceAnimation(divs) {
  let timer = 0;

  divs.forEach(div => {
    setTimeout(() => {
      div.classList.add('bounce');
    }, timer);

    setTimeout(() => {
      div.classList.remove('bounce');
    }, timer + 1000);
    timer += 100;
  })
}

function shakeAnimation(divs) {
  divs.forEach(div => {
    div.classList.add('shake');

    setTimeout(() => {
      div.classList.remove('shake');
    }, 500) 
  });
}

function tileFocusAnimation(tile) {
  tile.classList.add('tile-focus');

  setTimeout(() => {
    tile.classList.remove('tile-focus');
  }, 100) 
}

function tileFlipAnimation(tiles, results) {
  let timer = 0;

  tiles.forEach((tile, idx) => {
    let status = results[idx];
    setTimeout(() => {
      tile.classList.add('flip');
    }, timer);
    setTimeout(() => {
      tile.classList.add(status);
    }, timer + 250);


    timer += 600;
  })
}

export { bounceAnimation, shakeAnimation, tileFocusAnimation, tileFlipAnimation };