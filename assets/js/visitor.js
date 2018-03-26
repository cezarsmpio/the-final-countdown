'use strict';

{
  const roomId = getRoomId();
  const socket = io(`/${roomId}`);

  // Elements
  const countdowm = $('#js-countdown');
  const timeOver = $('#js-time-over');

  // Init
  hide(timeOver);

  socket.on('timer.update', ({ timer }) => {
    countdowm.innerHTML = timer;
  });

  socket.on('timer.start', () => {
    show(countdowm);
    hide(timeOver);
  });

  socket.on('timer.over', () => {
    hide(countdowm);
    show(timeOver);
  });
}
