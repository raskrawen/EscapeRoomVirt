// --- models/teamMachine.js ---
const { createMachine } = require('xstate');

// FSM med guard: må kun skifte til task1, hvis teamIsFull() er true
const teamMachine = createMachine({
  id: 'team',
  initial: 'lobby',

  context: {
    team: null // Vi forventer at få team-objektet som kontekst
  },

  states: {
    lobby: {
      on: {
        READY: {
          target: 'task1',
          cond: 'teamIsFull' // Navn på guard-funktion
        }
      },
      meta: {
        html: 'lobby.html'
      }
    },
    task1: {
      type: 'final',
      meta: {
        html: 'task1.html'
      }
    }
  }
}, {
  guards: {
    // Guard-funktion: bruger team-objektet gemt i context
    teamIsFull: (context, event) => {
      return context.team?.teamIsFull?.() === true;
    }
  }
});

module.exports = teamMachine;
