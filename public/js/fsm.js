// fsm.js
import { createMachine, state, transition } from 'robot3';

// FSM definition med to states: lobby og task1
export function createTeamFSM() {
  return createMachine({
    lobby: state(
      transition('NEXT', 'task1')
    ),
    task1: state()
  }, {
    context: () => ({}), // Kontekst ikke nødvendig pt.
    meta: {
      lobby: { html: 'lobby' },
      task1: { html: 'task1' }
    }
  });
}
