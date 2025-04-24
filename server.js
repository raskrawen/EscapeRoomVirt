//vers 1.1.0
// dato: april 2025
//features: two users

// Importing required modules
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');

// Creating an Express application
const app = express();

// Creating an HTTP server using the Express app
const server = http.createServer(app);

// Initializing a Socket.IO server and attaching it to the HTTP server
const io = new Server(server);

// Serving static files from the 'public' directory
app.use(express.static('public'));

// Room and client content mapping
const roomName = 'escapeRoom';
const clientContentMap = {};

// Listening for a new client connection to the Socket.IO server
io.on('connection', (socket) => {
    console.log(socket.id + ' connected');

    // Add the client to the room
    socket.join(roomName);

    // Assign content based on the number of clients in the room
    const clientsInRoom = io.sockets.adapter.rooms.get(roomName);
    const clientCount = clientsInRoom ? clientsInRoom.size : 0;

    const contentFile = clientCount === 1 ? 'levels/level1.html' : 'levels/level2.html';
    clientContentMap[socket.id] = contentFile;

    // Read and send the assigned content to the client
    fs.readFile(contentFile, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        console.log(`File ${contentFile} read successfully`);
        socket.emit('updateContent', data);
    });

    // Listen for level change requests
    socket.on('level', (level) => {
        console.log('Level received:', level);
        const newContentFile = `levels/level${level}.html`;
        clientContentMap[socket.id] = newContentFile;

        fs.readFile(newContentFile, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                return;
            }
            console.log(`File ${newContentFile} read successfully`);
            socket.emit('updateContent', data);
        });
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        delete clientContentMap[socket.id];
    });
});

// Defining the port number for the server
const PORT = 5500;

// Starting the server and listening on the specified port
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
