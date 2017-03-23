// @flow

import { expect } from 'chai';
import { shallowEqual } from '../src/utils';

describe('shallowEqual', () => {
  it('works', () => {
    expect(shallowEqual(4,4)).to.equal(true);
    const a = [];
    expect(shallowEqual(a, a)).to.equal(true);
    expect(shallowEqual([], [])).to.equal(true);
    expect(shallowEqual(4, '4')).to.equal(false);
    expect(shallowEqual([], 4)).to.equal(false);
    expect(shallowEqual({}, {})).to.equal(true);
    expect(shallowEqual({}, 4)).to.equal(false);
    expect(shallowEqual({ a, b: 4 }, 4)).to.equal(false);
    expect(shallowEqual({ a, b: 4 }, { a, b: 4 })).to.equal(true);
    expect(shallowEqual({ a, b: 4 }, { a: [], b: 4 })).to.equal(false);
  });
});
