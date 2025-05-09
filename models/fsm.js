// fsm.js (CommonJS-version)

// robot3 er et ES module og kan ikke bruges direkte med require()
// Derfor bruger vi en dynamisk import her:
async function createTeamFSM() {
  // Dynamisk import for at hente robot3 som ESM
  const robot3 = await import('robot3');

  // Udpak funktioner fra robot3
  const { createMachine, state, transition, interpret } = robot3;

  // Definer FSM med to states: lobby → task1
  const machine = createMachine({
    lobby: state(
      transition('NEXT', 'task1')
    ),
    task1: state()
  }, {
    meta: {
      lobby: { html: 'lobby' },
      task1: { html: 'task1' }
    }
  });

  // Gør FSM'en "levende" – så den kan reagere på .send('NEXT')
  const fsm = interpret(machine);

  return fsm;
}

// Eksporter som en Promise-returnerende funktion
module.exports = { createTeamFSM };
