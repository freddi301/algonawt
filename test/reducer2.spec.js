// @flow

import { expect } from 'chai';

// type ActionHandlers<State, Handlers> = $ObjMapi<Handlers, (...payload: *) => (state: State) => State};

export function run<State>(gen: Generator<(s: State) => State, void, State>): (s: State) => State {
  return (state: State): State => {
    const first = gen.next();
    if (first.done) return state;
    let effect: (s: State) => State = first.value;
    let done = false;
    do {
      state = effect(state);
      const every = gen.next(state);
      if (every.done) return state;
      effect = every.value;
      done = every.done;
    } while (!done);
    return state;
  };
}

export function red<State>(instructions: Array<(s: State) => State>): (s: State) => State {
  return state => instructions.reduce((state, instruction) => instruction(state), state);
}

const counter = {
  inc: n => s => s + n,
  dec: n => s => s - n
};

describe('light reducer', () => {
  describe('red', () => {
    const subroutine1 = (({ inc, dec }) => [
      inc(4),
      state => dec(state - 1)(state)
    ])(counter);
    const subroutine2 = (({ inc, dec }) => [
      inc(1),
      red(subroutine1),
      dec(1)
    ])(counter);
    it('works', () => {
      expect(red(subroutine1)(-2)).to.equal(1);
      expect(red(subroutine2)(-6)).to.equal(0);
    });
  });

  describe('run', () => {
    it('works', () => {
      const id = x => x;
      function * calculatrix ({ inc, dec }) {
        yield inc(2);
        yield dec((yield id) * 3);
      }
      const result = run(calculatrix(counter))(-1);
      expect(result).to.equal(-2);
    });
  });
});
