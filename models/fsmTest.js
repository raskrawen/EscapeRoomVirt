// fsmTest.js
const { createMachine, createActor } = require('xstate');

const testMachine = createMachine({
  id: 'test',
  initial: 'waiting',
  context: { data: 123 },
  states: {
    waiting: {
      on: {
        GO: {
          target: 'done',
          cond: (context) => {
            console.log('GUARD WAS CALLED with context:', context);
            return false;
          }
        }
      }
    },
    done: {
      type: 'final'
    }
  }
});

const actor = createActor(testMachine, {
  context: { data: 123 }
});

actor.start();
actor.send({ type: 'GO' });
