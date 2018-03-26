const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const crypto = require('crypto');
const port = process.env.PORT || 3000;

// Middlewares
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

app.use(logger('short'));
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.options('*', cors());
app.use(compression());
app.set('port', port);

app.use('/assets', express.static('assets'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/m/:roomId', (req, res) => {
  const roomId = req.params.roomId;
  const room = io.of(`/${roomId}`);
  const hostUrl = `${req.protocol}://${req.get('host')}`;

  room.on('connection', socket => {
    socket.on('timer.update', ({ timer }) => {
      room.emit('timer.update', { timer });
    });

    socket.on('timer.over', () => {
      room.emit('timer.over');
    });

    socket.on('timer.start', () => {
      room.emit('timer.start');
    });

    socket.on('timer.pause', () => {
      room.emit('timer.pause');
    });

    socket.on('timer.stop', () => {
      room.emit('timer.stop');
    });

    socket.on('timer.over', () => {
      room.emit('timer.over');
    });
  });

  res.render('countdown-manager', {
    shareUrl: `${hostUrl}/v/${roomId}`,
  });
});

app.get('/v/:roomId', (req, res) => {
  res.render('countdown-visitor');
});

app.use((req, res) => {
  res.redirect('/');
});

// Socket
io.on('connection', socket => {
  console.log('a user connected!');

  socket.on('room.create', () => {
    const roomId = crypto.randomBytes(10).toString('hex');

    socket.join(roomId);

    socket.emit('room.created', roomId);

    console.log('a room has created with id: ', roomId);
  });

  socket.on('disconnect', function() {
    console.log('A user got disconnect!');
 });
});

server.listen(port, () => {
  console.log('Running!');
});
