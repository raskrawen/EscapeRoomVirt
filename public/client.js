//old, integrated in welcome_page.html


// Use the existing global socket instance
const socket = window.socket;

// Handle the form submit where player chooses a team
document.getElementById('teamForm').addEventListener('submit', (e) => {
  e.preventDefault();

  // Get the team ID from the input field
  const teamId = document.getElementById('teamIdInput').value.trim();

  if (!teamId) {
    alert('Please enter a team ID!');
    return;
  }

  // Send team ID to the server
  socket.emit('joinTeam', { teamId });
});

// Listen for server responses:

// If the team is full
socket.on('teamFull', () => {
  alert('Sorry, this team is already full. Please choose another team.');
});

// Update when team members change
socket.on('teamUpdate', (data) => {
  console.log('Team updated:', data);
  // You could update a UI list of connected players here
});

// When team is ready to start
socket.on('teamReady', (data) => {
  console.log(data.message);
  // Redirect to game page automatically, or show a start button
  window.location.href = '/game.html'; // Example: redirect to game
});

// Handle general errors
socket.on('errorJoiningTeam', (error) => {
  alert('Error: ' + error.message);
});

