// --- server/state.js ---
const teams = new Map(); // teamId -> Team
const players = new Map(); // playerId -> Player

module.exports = {
  teams,
  players
};