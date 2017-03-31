// @flow

import { expect } from 'chai';

import { createReducer } from '../src/Reducer';

const counter = createReducer({
  inc: s => n => s + n,
  dec: s => n => s - n,
});

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

describe('inner reducers', () => {
  const motd = createReducer({ change: () => (a: string) => a });
  const concierge = createReducer({
    essay: s => t => ({ ...s, word: motd(s.word).change(t).state }),
    count: s => c => ({ ...s, likes: c(counter(s.likes)).state }),
  })({ word: '', likes: 0 });
  expect(concierge.essay('hi').state).to.deep.equal({ word: 'hi', likes: 0 });
  expect(concierge.count(cntr => cntr.inc(1)).state).to.deep.equal({ word: '', likes: 1 });
});
