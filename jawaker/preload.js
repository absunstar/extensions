module.exports = function (SOCIALBROWSER) {
  SOCIALBROWSER.addHTML = function (code) {
    try {
      if (document.body) {
        let _div = document.createElement('div');
        _div.id = '_div_' + Math.random();
        _div.innerHTML = code;
        document.body.appendChild(_div);
      }
    } catch (error) {
      SOCIALBROWSER.log(error);
    }
  };

  if (document.location.href.contains('jawaker.com')) {
    var __triggerMouseEvent = function (node, eventType) {
      try {
        if (document.createEvent) {
          var clickEvent = document.createEvent('MouseEvents');
          clickEvent.initEvent(eventType, true, true);
          node.dispatchEvent(clickEvent);
        } else {
          document.documentElement['MouseEvents']++;
        }
      } catch (err) {}
    };

    function getOffset(el) {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + window.scrollX,
        y: rect.top,
      };
    }

function __play__(){
    let firstCard = document.querySelector('#table-stack .card');
    let className = '';
    let gameType = '';

    if (firstCard) {
      if (firstCard.className.contains('heart')) {
        className = 'heart';
      } else if (firstCard.className.contains('diamond')) {
        className = 'diamond';
      } else if (firstCard.className.contains('spade')) {
        className = 'spade';
      } else if (firstCard.className.contains('club')) {
        className = 'club';
      }
    }

    let cards = document.querySelectorAll('.hand.card-stack.fanned.loose.rotate-bottom.ui-droppable .card');
    cards.forEach((card, i) => {
      if (card.className.contains(className)) {
        setTimeout(() => {
          card.classList.add('xxx');
          __triggerMouseEvent(card, 'mousedown');
          __triggerMouseEvent(card, 'mouseup');
          if (SOCIALBROWSER.currentWindow && SOCIALBROWSER.webContents) {
            let x = getOffset(card).x;
            let y = getOffset(card).y;
            SOCIALBROWSER.currentWindow.focus();
            SOCIALBROWSER.webContents.sendInputEvent({ type: 'mouseDown', x: x, y: y, button: 'left', clickCount: 1 });
            SOCIALBROWSER.webContents.sendInputEvent({ type: 'mouseUp', x: x, y: y, button: 'left', clickCount: 1 });
            console.log(`Click ${x} - ${y}`);
          }
          setTimeout(() => {
            card.classList.remove('xxx');
          }, 200);
        }, 100 * i);
      }
    });
}



    SOCIALBROWSER.onLoad(() => {
      alert('Bot Supported');
      SOCIALBROWSER.fs = SOCIALBROWSER.require('fs');
      SOCIALBROWSER.addHTML(SOCIALBROWSER.fs.readFileSync(__dirname + '/code.html').toString());
      SOCIALBROWSER.menu_list.push({
        label: 'Start Play ^_^',
        click: () => {
            setInterval(() => {
              __play__();
            }, 1000 * 3);
        },
      });
      SOCIALBROWSER.menu_list.push({ type: 'separator' });
    });
  }
};
