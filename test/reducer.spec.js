// @flow

import { expect } from 'chai';

import { createReducer } from '../src/reducer';

const ci = {
  inc: n => s => s + n,
  dec: n => s => s - n,
};
const counter = createReducer(ci);

const counteri = counter(0);

describe('createReducer', () => {
  it('works', () => {
    expect(counteri.state).to.equal(0);
    expect(counteri.inc(3).state).to.equal(3);
    expect(counteri.dec(4).state).to.equal(-4);
    expect(counteri.inc(2).dec(4).state).to.equal(-2);
    expect(counteri.state).to.equal(0);
  });
});

const mount = (k, r) => c => s => ({ ...s, [k]: (c(r(s[k])).state) });
const seq = i => r => r.seq(i);

describe('inner reducers', () => {
  const motd = createReducer({ change: (a: string) => () => a });
  const cr = createReducer({
    essay: t => s => ({ ...s, word: motd(s.word).change(t).state }),
    count: c => s => ({ ...s, likes: c(counter(s.likes)).state }),
    love: mount('love', counter),
    complex: n => s => cr(s).seq([
      r => r.essay('buddy'),
      r => r.count(cnt => cnt.inc(2)),
      r => r.love(seq([
        r => r.inc(n),
        r => r.dec(40)
      ]))
    ]).state
  });
  const concierge = cr({ word: '', likes: 0, love: 0 });
  it('works', () => {
    expect(concierge.essay('hi').state).to.deep.equal({ word: 'hi', likes: 0, love: 0 });
    expect(concierge.count(cntr => cntr.inc(1)).state).to.deep.equal({ word: '', likes: 1, love: 0 });
    expect(concierge.love(l => l.inc(1)).state).to.deep.equal({ word: '', likes: 0, love: 1 });
    expect(counter(0).seqr([
      ci.inc(1),
      ci.dec(4),
    ])).to.deep.equal(-3);
  });
  it('does complex ops', () => {
    expect(concierge.complex(4).state).to.deep.equal({ love: -36, likes: 2, word: 'buddy' });
  });
});

describe('merging reducers', () => {
  it('works', () => {
    const reducerA = {
      a: (a: number) => s => ({ ...s, a })
    };
    const reducerB = {
      b: (b: string) => s => ({ ...s, b })
    };
    const merged = createReducer({ ...reducerA, ...reducerB });
    const inst = merged({ a: 6, b: 'hello' });
    expect(inst.a(5).state).to.deep.equal({ a: 5, b: 'hello' });
    expect(inst.b('5').state).to.deep.equal({ a: 6, b: '5' });
  });
});
