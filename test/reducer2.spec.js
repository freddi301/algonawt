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

const nest = (outerAction, innerSelector, innerAction, value) => {
  return outer => outerAction(innerAction(value)(innerSelector(outer)))(outer);
};

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
    const id = x => x;
    it('works', () => {
      function * calculatrix ({ inc, dec }) {
        yield inc(2);
        yield dec((yield id) * 3);
      }
      const result = run(calculatrix(counter))(-1);
      expect(result).to.equal(-2);
    });
  });
  describe('nested classes', () => {
    class Person {
      name: string = 'fred';
      clothes: Suit = new Suit;
      static rename = (name: string) => (p: Person): Person => {
        const ret = new Person;
        ret.name = name;
        ret.clothes = p.clothes;
        return ret;
      }
      static changeClothes = (clothes: Suit) => (p: Person): Person => {
        const ret = new Person;
        ret.name = p.name;
        ret.clothes = clothes;
        return ret;
      }
      static clothes = (p: Person): Suit => p.clothes;
    }
    class Suit {
      pants: Pants = new Pants;
      tShirt: TShirt = new TShirt;
      static changePants = (pants: Pants) => (s: Suit): Suit => {
        const ret = new Suit;
        ret.tShirt = s.tShirt;
        ret.pants = pants;
        return ret;
      }
    }
    class Pants {} class TShirt {} class Skirt extends Pants {}
    const { rename, changeClothes, changePants, clothes } = { ...Person, ...Suit };
    const bob = red([
      rename('bob'),
      bob => changeClothes(
        changePants(new Skirt)(bob.clothes)
      )(bob)
    ])(new Person);
    expect(bob.name).to.equal('bob');
    expect(bob.clothes.pants).to.be.instanceof(Skirt);
    //const id = x => x;
    const bobby = run(function * () {
      yield rename('bobby');
      yield nest(changeClothes, clothes, changePants, new Skirt);
    }())(new Person);
    expect(bobby.name).to.equal('bobby');
    expect(bobby.clothes.pants).to.be.instanceof(Skirt);
  });
});
