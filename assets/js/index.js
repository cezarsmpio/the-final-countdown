'use strict';

const socket = io();

// Create a room
const createRoomButton = $('#js-create-room');

createRoomButton.addEventListener('click', () => {
  socket.emit('room.create');
});

socket.on('room.created', roomId => {
  localStorage.setItem('roomId', roomId);

  window.location = `/m/${roomId}`;
});
