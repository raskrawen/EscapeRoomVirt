// start server.js by running `node server/server.js` (or node server.js)

require('dotenv').config(); // Load environment variables from .env at the very top

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

// Konfigurer session
const sessionMiddleware = session({
  secret: 'escape-room-secret',
  resave: false,
  saveUninitialized: true
});

// fx i server.js eller et config-modul
global.maxPlayers = 2;



app.use(sessionMiddleware);
io.use(sharedSession(sessionMiddleware, { autoSave: true }));

// Server statiske filer fra /public
app.use(express.static(path.join(__dirname, '../public')));

// Tilføj en route for at servere index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// I server.js eller routes/admin.js
app.get('/setMaxPlayers', (req, res) => {
  const value = parseInt(req.query.value, 10);
  if (!isNaN(value) && value > 0) {
    global.maxPlayers = value;
    res.send(`maxPlayers sat til ${value}`);
  } else {
    res.status(400).send('Ugyldig værdi');
  }
});


// Tilslut socket-handler
setupSocketHandler(io);



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}, http://localhost:${PORT}`);
});
