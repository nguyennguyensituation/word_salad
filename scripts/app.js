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

document.addEventListener('DOMContentLoaded', () => {
  const myGame = new Game;
  myGame.init();
})

