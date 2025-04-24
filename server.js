//vers 1.0.0
// dato: april 2025
//features: one level, one user

// Importing required modules
const express = require('express'); // Express framework for handling HTTP requests and serving static files
const http = require('http'); // Node.js HTTP module to create a server
const { Server } = require('socket.io'); // Socket.IO for real-time, bidirectional communication
const axios = require('axios'); // Axios for making HTTP requests (e.g., to external APIs)
const fs = require('fs'); // File System module to read files

// Creating an Express application
const app = express();

// Creating an HTTP server using the Express app
const server = http.createServer(app);

// Initializing a Socket.IO server and attaching it to the HTTP server
const io = new Server(server);

// Serving static files from the 'public' directory
app.use(express.static('public'));

// Listening for a new client connection to the Socket.IO server
io.on('connection', (socket) => {
    console.log('A user connected'); // Logs when a user connects

    // Emit the current level to the client
    const level = 4; // Example level value
    socket.emit('updateLevel', level);

    // Read the HTML file and send its content to the client
    fs.readFile('levels/level1.html', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        console.log('File read successfully'); // Logs when the file is read successfully
        // Emit the HTML content to the client
        socket.emit('updateContent', data);
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Defining the port number for the server
const PORT = 5500;

// Starting the server and listening on the specified port
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Logs the server URL
});
