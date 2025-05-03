const io = require('socket.io-client');
const { setupSocketHandler } = require('../server/socketHandler');
const { players, teams } = require('../server/state');

describe('User Data Consistency', () => {
  let clientSocket;

  beforeAll((done) => {
    const server = require('http').createServer();
    const ioServer = require('socket.io')(server);
    setupSocketHandler(ioServer);

    server.listen(() => {
      const port = server.address().port;
      clientSocket = io(`http://localhost:${port}`);
      done();
    });
  });

  afterAll(() => {
    clientSocket.close();
  });

  test('User data is saved and consistent', (done) => {
    const playerName = 'TestUser';
    const teamId = 'Team1';

    clientSocket.emit('joinTeam', { playerName, teamId });

    clientSocket.on('playerInfo', (data) => {
      expect(data.playerName).toBe(playerName);
      expect(data.teamId).toBe(teamId);
      done();
    });
  });
});