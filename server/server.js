// Import necessary modules and dependencies
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const session = require('express-session');
const sharedSession = require('express-socket.io-session');
const { setupSocketHandler } = require('./socketHandler');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Configure session middleware
const sessionMiddleware = session({
  secret: 'escape-room-secret', // Secret key for session encryption
  resave: false, // Avoid resaving unchanged sessions
  saveUninitialized: true // Save uninitialized sessions
});

// Log incoming requests for debugging
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Apply session middleware to Express
app.use(sessionMiddleware);
console.log('Session middleware initialized');

// Share session between Express and Socket.io
io.use(sharedSession(sessionMiddleware, { autoSave: true }));
console.log('Socket.io shared session initialized');

// Setup Socket.io event handlers
setupSocketHandler(io);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));
console.log('Serving static files from public directory');

// Serve the landing page (index.html) for the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

console.log('Socket handler setup complete');

// Start the server and listen on the specified port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
