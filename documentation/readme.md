version: 1.3.10
dato: maj 2025
Start server by: "nodemon server/server.js" og "node server/server.js".
git status

1. Make a new branch from project.
2. git push origin new_branch:main --force (This will overwrite the remote main branch with the contents/history of your local new_branch.)
3. Switch to main branch. Run pull (gets the remote main to local VS code)



features:
1.4.1:
    max players can be set by http://localhost:3000/setMaxPlayers?value=4
1.4.0:
    info page
    landing page, start.html (not a state since there is no team yet)
    images
    audio, audioManager.js
1.3.12: 
    learninglabs assignment added to task3a.
1.3.11:
    transition to task 3 with two different views.
    transition to task 2 possible.
    topBar display teamId.
    topBar in six fields.
    timer implemented.
    refactor: remove uuid identification on reconnect.
    UUid is only availible on the client-side
1.3.10:
    refactor for SRP (single responsibility-pattern): Team
1.3.9:
    refactor state pattern implementation.
1.3.8: (1.3.5 and 1.3.8 has mixed files.)
    -state pattern implemented.    
1.3.7: robot3, not working
1.3.6: XState, not working
1.3.5:
    -playerNumberOnTeam.
    -display two different pages: game.html and task1.html.
1.3.4 new features:
    -feedback and reset joinTeam when a third player tries to join a team.
    -save socket.id in player-objects (need to send client specific msg to socket).
    -import lobby.html and game.html into index.html.
1.3.3 new features:
    Displays lobby.html to game.html in index.html
    clean up players and teams
    feedback in lobby.
    test for cleanup and save player data
1.3.2 and before:
    to brugere i hvert team. 
    Connection følger brugeren. den har samme session-id, ikke nødvendigvis samme socket-id.
    landing page = index.html, 


    