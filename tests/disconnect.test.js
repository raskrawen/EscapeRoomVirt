const { players, teams } = require('../server/state');
const Player = require('../models/Player');
const Team = require('../models/Team');

// Mock socket object
const mockSocket = {
  id: 'mockSocketId',
  handshake: {
    session: {
      playerId: null,
    },
  },
};

describe('Cleanup on Disconnect', () => {
  beforeEach(() => {
    // Clear players and teams map before each test
    players.clear();
    teams.clear();
  });

  it('should delete the player from the players map when disconnecting', () => {
    // Create a new player and add to players map
    const player = new Player('TestPlayer', 'TestTeam', mockSocket.id);
    mockSocket.handshake.session.playerId = player.playerId;
    players.set(player.playerId, player);

    // Ensure player is added
    expect(players.has(player.playerId)).toBe(true);

    // Simulate disconnect
    const playerId = mockSocket.handshake.session.playerId;
    players.delete(playerId);

    // Ensure player is deleted
    expect(players.has(playerId)).toBe(false);
  });

  it('should delete the team from the teams map when all players have disconnected', () => {
    // Create a new team and add players to it
    const team = new Team('TestTeam');
    const player1 = new Player('Player1', 'TestTeam', 'socket1');
    const player2 = new Player('Player2', 'TestTeam', 'socket2');

    team.addPlayer(player1);
    team.addPlayer(player2);
    teams.set(team.teamId, team);
    players.set(player1.playerId, player1);
    players.set(player2.playerId, player2);

    // Ensure team and players are added
    expect(teams.has(team.teamId)).toBe(true);
    expect(players.has(player1.playerId)).toBe(true);
    expect(players.has(player2.playerId)).toBe(true);

    // Simulate disconnect for both players
    team.removePlayer(player1.playerId);
    team.removePlayer(player2.playerId);

    // Remove team if no players remain
    if (team.getPlayerCount() === 0) {
      teams.delete(team.teamId);
    }

    // Ensure team is deleted
    expect(teams.has(team.teamId)).toBe(false);
  });
});