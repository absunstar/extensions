SOCIALBROWSER.jawaker = {
  gameType: null,
  firstCard: null,
  firstCardType: null,
  canPlay: false,
  autoPlayInterval: null,
};
SOCIALBROWSER.jawaker.autoPlay = function () {
  document.querySelector('#play_btn').classList.add('hide');
  document.querySelector('#stop_btn').classList.remove('hide');
  SOCIALBROWSER.jawaker.canPlay = true;
  clearInterval(SOCIALBROWSER.jawaker.autoPlayInterval);
  SOCIALBROWSER.jawaker.autoPlayInterval = setInterval(() => {
    SOCIALBROWSER.jawaker.Play();
  }, 1000 * 5);
};
SOCIALBROWSER.jawaker.stopPlay = function () {
  document.querySelector('#play_btn').classList.remove('hide');
  document.querySelector('#stop_btn').classList.add('hide');
  SOCIALBROWSER.jawaker.canPlay = false;
  clearInterval(SOCIALBROWSER.jawaker.autoPlayInterval);
};
SOCIALBROWSER.jawaker.Play = function () {
  if (!SOCIALBROWSER.jawaker.canPlay) {
    SOCIALBROWSER.log('xxx Not can Play xxx');
    return;
  }
  SOCIALBROWSER.log('Play ....');
  if (document.querySelector('a.play-now')) {
    SOCIALBROWSER.click('a.play-now');
    SOCIALBROWSER.log('Play Now Clicked');
    return;
  }
  if (document.querySelector('.player-actions a')) {
    SOCIALBROWSER.click('.player-actions a');
    SOCIALBROWSER.log('Ready Clicked');
    return;
  }
  if (document.querySelector('#game-summary a')) {
    SOCIALBROWSER.click('#game-summary a');
    SOCIALBROWSER.log('Play Again');
    return;
  }

  
  if (document.querySelector('.modal-wrapper button')) {
    SOCIALBROWSER.click('.modal-wrapper button');
    SOCIALBROWSER.log('Back to game Clicked');
    return;
  }

  SOCIALBROWSER.jawaker.played = false;
  SOCIALBROWSER.jawaker.firstCardType = null;
  SOCIALBROWSER.jawaker.firstCard = null;

  SOCIALBROWSER.jawaker.firstCard = document.querySelector('#table-stack .card');

  if (SOCIALBROWSER.jawaker.firstCard) {
    if (SOCIALBROWSER.jawaker.firstCard.className.contains('heart')) {
      SOCIALBROWSER.jawaker.firstCardType = 'heart';
    } else if (SOCIALBROWSER.jawaker.firstCard.className.contains('diamond')) {
      SOCIALBROWSER.jawaker.firstCardType = 'diamond';
    } else if (SOCIALBROWSER.jawaker.firstCard.className.contains('spade')) {
      SOCIALBROWSER.jawaker.firstCardType = 'spade';
    } else if (SOCIALBROWSER.jawaker.firstCard.className.contains('club')) {
      SOCIALBROWSER.jawaker.firstCardType = 'club';
    }
  }

  let cards = document.querySelectorAll('.hand.card-stack.fanned.loose.rotate-bottom.ui-droppable .card');
  cards.forEach((card, i) => {
    if (SOCIALBROWSER.jawaker.firstCardType && card.className.contains(SOCIALBROWSER.jawaker.firstCardType)) {
      SOCIALBROWSER.jawaker.played = true;
      setTimeout(() => {
        card.classList.add('xxx');
        SOCIALBROWSER.click(card);
        setTimeout(() => {
          card.classList.remove('xxx');
        }, 200);
      }, 100 * i);
    }
    if (!SOCIALBROWSER.jawaker.played) {
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.classList.add('xxx');
          SOCIALBROWSER.click(card);
          setTimeout(() => {
            card.classList.remove('xxx');
          }, 200);
        }, 100 * i);
      });
    }
  });
};
