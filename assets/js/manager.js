'use strict';

{
  const timer = new Timer();
  const defaultTimer = '00:00:00';
  const defaultMinutes = 20;
  const getTimer = () => timer.getTimeValues().toString();
  const roomId = getRoomId();
  const socket = io(`/${roomId}`);

  // Elements
  const roomLinkInput = $('#js-room-link');
  const startTimer = $('#js-start');
  const pauseTimer = $('#js-pause');
  const stopTimer = $('#js-stop');
  const timerInput = $('#js-timer');
  const countdowm = $('#js-countdown');
  const timeOver = $('#js-time-over');
  const copyLinkButton = $('#js-copy-link');

  // Init
  hide(pauseTimer);
  hide(stopTimer);
  hide(timeOver);

  socket.emit('timer.update', { timer: getTimer() });

  // Select link
  roomLinkInput.addEventListener('click', () => {
    roomLinkInput.select();
  });

  // Start timer
  startTimer.addEventListener('click', () => {
    timer.start({
      countdown: true,
      startValues: {
        minutes: parseInt(timerInput.value || defaultMinutes, 10),
      },
    });

    show(countdowm);
    hide(timeOver);

    hide(startTimer);
    hide(timerInput);
    show(pauseTimer);
    show(stopTimer);

    socket.emit('timer.start');
    socket.emit('timer.update', { timer: getTimer() });
  });

  // Stop timer
  stopTimer.addEventListener('click', () => {
    timer.stop();

    countdowm.innerHTML = defaultTimer;

    show(startTimer);
    show(timerInput);
    hide(pauseTimer);
    hide(stopTimer);

    socket.emit('timer.stop');
    socket.emit('timer.update', { timer: getTimer() });
  });

  // Pause timer
  pauseTimer.addEventListener('click', () => {
    timer.pause();

    show(startTimer);
    hide(pauseTimer);

    socket.emit('timer.pause');
    socket.emit('timer.update', { timer: getTimer() });
  });

  // Update timer
  timer.addEventListener('secondsUpdated', () => {
    countdowm.innerHTML = getTimer();

    socket.emit('timer.update', { timer: getTimer() });
  });

  // When timer is over
  timer.addEventListener('targetAchieved', () => {
    hide(countdowm);
    show(timeOver);

    show(startTimer);
    show(timerInput);
    hide(pauseTimer);
    hide(stopTimer);

    socket.emit('timer.over');
    socket.emit('timer.update', { timer: getTimer() });
  });

  // Copy visitor link
  const clipboard = new ClipboardJS(copyLinkButton, {
    target: () => roomLinkInput,
  });

  clipboard.on('success', (e) => {
    copyLinkButton.innerText = 'Copied!';

    window.setTimeout(() => {
      copyLinkButton.innerText = 'Copy';
    }, 3000);
  });
}
