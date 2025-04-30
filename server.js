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
    console.log(`${socket.id} connected`);

    // Store socket.id in the session as playerId
    socket.handshake.session.playerId = socket.id;
    socket.handshake.session.save();

    // Emit socketId to the client
    socket.emit('socketId', socket.id);

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
    });
});



// Emit a redirection event to all connected clients when a team is ready
io.on('connection', (socket) => {
  socket.on('teamReady', () => {
    io.emit('redirect', { url: '/game_temp.html' });
  });
});

// Defining the port number for the server
const PORT = 5500;

// Starting the server and listening on the specified port
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
