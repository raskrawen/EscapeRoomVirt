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
        },
        UPDATE_TEAM: {
          actions: 'updateTeamContext' // Update team context when this event is received
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
  },
  actions: {
    updateTeamContext: (context, event) => {
      console.log('Updating team context with:', event.team); // Log the update
      context.team = event.team; // Update the team in context
    }
  }
}, {
  guards: {
    // Guard-funktion: bruger team-objektet gemt i context
    teamIsFull: (context, event) => {
        console.log('teamIsFull guard called with context:', context); // Log context for debugging
        if (!context.team) {
            console.log('Context.team is null or undefined');
            return false;
        }
        if (typeof context.team.teamIsFull !== 'function') {
            console.log('teamIsFull is not a function on context.team:', context.team);
            return false;
        }
        const result = context.team.teamIsFull();
        console.log('Result of teamIsFull:', result);
        return result === true;
    }
  }
});

module.exports = teamMachine;
