//vers 1.2.0
// dato: april 2025
//features: two users. One welcome page

// Importing required modules
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const session = require('express-session');
const socketio = require('socket.io');
const path = require('path');
// from socketHandler.js:
const { setupSocketHandlers } = require('./socketHandler');

// Creating an Express application
const app = express();

// Creating an HTTP server using the Express app
const server = http.createServer(app);

// Initializing a Socket.IO server and attaching it to the HTTP server
const io = new Server(server);

const clientContentMap = {}; // Store content for each client
// Session setup
const sessionMiddleware = session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
  });
  app.use(sessionMiddleware);
  
  // Share session with Socket.IO
  const sharedSession = require('express-socket.io-session'); // Importing shared session middleware
  io.use(sharedSession(sessionMiddleware, { autoSave: true })); // Automatically save session after each request
  
  // Setup socket handlers from socketHandler.js
  setupSocketHandlers(io);

// Serving static files from the 'public' directory
app.use(express.static('public'));


// Ensure teamId is only used after the client sends it
io.on('connection', (socket) => {
    console.log(socket.id + ' connected');

    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading index.html:', err);
            return;
        }
        socket.emit('updateContent', data);
    });

 /*    socket.on('teamReady', () => { //may be redundant, handled in welcome_page.html  
        const contentPath = clientCount === 1 ? 'levels/level1.html' : 'levels/level2.html';
        console.log('Content file to serve:', contentPath);
        fs.readFile(contentPath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }
            clientContentMap[socket.id] = data;
            console.log(`File read successfully`);
            socket.emit('updateContent', clientContentMap[socket.id]);
        });
    }); */
    

    // Listen for level change requests
    socket.on('changeLevel', (level) => {
        console.log('Level received:', level);
                
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected from server.js');
        //delete clientContentMap[socket.id];
    });
});

// Serve game content to game.html
io.on('connection', (socket) => {
  
    socket.on('requestGameContent', () => {
    console.log('Requesting game content for player:', socket.id);
    const teamId = socket.handshake.session.teamId;
    const playerId = socket.id;

    if (!teams[teamId]) {
      socket.emit('error', { message: 'Team not found' });
      return;
    }

    const team = teams[teamId];
    const player = team.players[playerId];

    if (!player) {
      socket.emit('error', { message: 'Player not found in team' });
      return;
    }

    // Serve different content based on player position
    const playerIndex = Object.keys(team.players).indexOf(playerId);
    const contentPath = playerIndex === 0 ? 'levels/level1.html' : 'levels/level2.html';

    fs.readFile(path.join(__dirname, contentPath), 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        socket.emit('error', { message: 'Failed to load game content' });
        return;
      }

      socket.emit('gameContent', data);
    });
  });
});

// Defining the port number for the server
const PORT = 5500;

// Starting the server and listening on the specified port
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
