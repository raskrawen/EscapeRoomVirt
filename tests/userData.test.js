const io = require('socket.io-client');
const { setupSocketHandler } = require('../server/socketHandler');
const { players, teams } = require('../server/state');

// Mock session middleware
const sessionMiddleware = (req, res, next) => {
  req.session = {}; // Mock session object
  next();
};

// Mock session for socket.io
const mockSocketSessionMiddleware = (socket, next) => {
  socket.handshake = {
    session: {
      save: jest.fn(), // Mock the save method
    },
  };
  next();
};

describe('User Data Consistency', () => {
  let clientSocket, server, ioServer;

  beforeAll((done) => {
    server = require('http').createServer();
    ioServer = require('socket.io')(server);

    // Apply mock session middleware for socket.io
    ioServer.use(mockSocketSessionMiddleware);

    setupSocketHandler(ioServer);

    server.listen(() => {
      const port = server.address().port;
      clientSocket = io(`http://localhost:${port}`);
      done();
    });
  });

  afterAll((done) => {
    clientSocket.disconnect();
    ioServer.close();
    server.close(done);
  });

  test('User data is saved and consistent', (done) => {
    jest.setTimeout(10000); // Increase timeout to 10 seconds

    const playerName = 'TestUser';
    const teamId = 'Team1';

    clientSocket.emit('joinTeam', { playerName, teamId });
    clientSocket.emit('requestPlayerInfo');

    clientSocket.on('playerInfo', (data) => {
      try {
        expect(data.playerName).toBe(playerName);
        expect(data.teamId).toBe(teamId);
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});