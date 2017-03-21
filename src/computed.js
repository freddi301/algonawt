// @flow

import { shallowEqual, memoizeLast } from './utils';

export function computed<I, O, D: {[keys: string]: (i: I) => mixed}>(
  deps: D,
  compute: (dp: $ObjMap<D, <V>(v: (i: I) => V) => V>) => O
): (i: I) => O {
  const memoized = memoizeLast(compute, shallowEqual);
  return i => memoized(
    Object.keys(deps).reduce((ret, k) => { ret[k] = deps[k](i); return ret; }, {})
  );
}
