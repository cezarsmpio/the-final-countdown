'use strict';

// Utils
const $ = el => document.querySelector(el);
const $$ = el => document.querySelectorAll(el);

const hide = el => {
  el.style.display = 'none';
};

const show = (el, display = 'block') => {
  el.style.display = display;
};

const setRoomId = roomId => localStorage.setItem('roomId', roomId);

const getRoomId = () =>
  localStorage.getItem('roomId') || location.pathname.split('/').reverse()[0];
