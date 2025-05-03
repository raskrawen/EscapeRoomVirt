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

// Log incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Log session data
app.use(sessionMiddleware);
console.log('Session middleware initialized');

io.use(sharedSession(sessionMiddleware, { autoSave: true }));
console.log('Socket.io shared session initialized');

setupSocketHandler(io);

// Log static file serving
app.use(express.static(path.join(__dirname, '../public')));
console.log('Serving static files from public directory');


console.log('Socket handler setup complete');

server.listen(3000, () => {
  console.log('Server listening on http://localhost:3000');
});
