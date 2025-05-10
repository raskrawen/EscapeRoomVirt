version: 1.3.4
dato: maj 2025
Start server by: "nodemon server/server.js" og "node server/server.js".

Overwrite 'main' by "Force Push" (to default branch set by "git branch --set-upstream-to=origin/main") 
OR:
Overwrite main branch by: change to main. Merge from vERversx.y.z

features:
1.3.8:
    -state pattern implemnented.
    
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


    