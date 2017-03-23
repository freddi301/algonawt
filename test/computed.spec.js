// @flow

import { expect } from 'chai';
import { computed } from '../src/computed';

describe('computed', () => {
  it('works', () => {
    let executed = 0;
    const cached = computed({
      x: ({ x }) => x,
      y: ({ y }) => y
    }, ({ x, y }) => {
      executed++;
      return x + y;
    });
    expect(executed).to.equal(0);
    expect(cached({ x: 2, y: 6 })).to.equal(8);
    expect(executed).to.equal(1);
    expect(cached({ x: 2, y: 6 })).to.equal(8);
    expect(executed).to.equal(1);
    expect(cached({ x: 2, y: 6 })).to.equal(8);
    expect(executed).to.equal(1);
    expect(cached({ x: 2, y: 4 })).to.equal(6);
    expect(executed).to.equal(2);
    expect(cached({ x: 2, y: 4 })).to.equal(6);
    expect(executed).to.equal(2);
  });
});
