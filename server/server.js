// --- server/server.js ---
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const session = require('express-session');
const sharedSession = require('express-socket.io-session');
const { setupSocketHandler } = require('./socketHandler');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const sessionMiddleware = session({
  secret: 'escape-room-secret',
  resave: false,
  saveUninitialized: true
});

app.use(sessionMiddleware);
io.use(sharedSession(sessionMiddleware, { autoSave: true }));

app.use(express.static(path.join(__dirname, '../public')));

setupSocketHandler(io, sharedSession);

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
