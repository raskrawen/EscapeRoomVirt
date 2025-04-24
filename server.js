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
//app.use(express.static('levels'));

// Listening for a new client connection to the Socket.IO server
io.on('connection', (socket) => {
    let levelNumber = 1; // Initialize the level number

    console.log('A user connected'); // Logs when a user connects

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

    //listen to level number from levels.
    socket.on('level', (level) => {
        console.log('Level received:', level); // Logs the received level
        levelNumber = level; // Update the level number
        socket.emit('updateLevel', levelNumber); // Emit the updated level number to the client
        
            console.log('Level 2 requested'); // Logs when level 2 is requested
        fs.readFile('levels/level2.html', 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }
            console.log('File read successfully'); // Logs when the file is read successfully
            // Emit the HTML content to the client
            socket.emit('updateContent', data);
        });
    
    });

    // Listen for 'nextLevel' event from the client
    socket.on('nextLevel', (data) => {
        console.log('Next level requested:', levelNumber);
        // Update the level and emit it to all clients
        //io.emit('updateLevel', data.level);
    });

    socket.on('message', (message) => {
        console.log('Message received:', message); // Logs the received message
        // Emit the message to all clients
        //io.emit('message', message);
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
