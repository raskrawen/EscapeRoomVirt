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
          //cond: 'teamIsFull' // Navn på guard-funktion
          cond: (context, event) => {
            console.log('THIS GUARD RUNS');
            return false;
          }
        }
      },
      meta: {
        html: 'lobby'
      }
    },
    task1: {
      type: 'final',
      meta: {
        html: 'task1'
      }
    }
  }
}, {
  guards: {
    // Guard-funktion: bruger team-objektet gemt i context
    teamIsFull: (context, event) => {
        console.log('teamIsFull guard called with context:', context); // Log context for debugging
        console.log('result of teamIsFull:', context.team?.teamIsFull?.()); // Log result of teamIsFull 
        return context.team?.teamIsFull?.() === true;
    }
  }
});

module.exports = teamMachine;
