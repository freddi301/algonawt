// @flow

const hasOwnProperty = Object.prototype.hasOwnProperty;

function is(x, y) {
  if (x === y) { return isNaN(x); }
  return x !== x && y !== y;
}

export function shallowEqual(objA: mixed, objB: mixed): boolean {
  if (is(objA, objB)) return true;
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) return false;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) return false;
  }
  return true;
}

export function exact(a: mixed, b: mixed): boolean { return a === b; }
export function memoizeLast<I, O>(f: (i: I) => O, compare: (a: mixed, b: mixed) => boolean = exact): (i: I) => O {
  let lastI: I; let lastO: O;
  return a => {
    if (compare(lastI, a)) return lastO;
    lastI = a; lastO = f(a); return lastO;
  };
}

/*
export function shallowCopy(original: Object) {
  const clone = Object.create(Reflect.getPrototypeOf(original));
  const keys = Object.getOwnPropertyNames(original); // eslint-disable-line prefer-reflect
  for (let i = 0; i < keys.length; i ++) {
    Reflect.defineProperty(clone, keys[i], Reflect.getOwnPropertyDescriptor(original, keys[i]));
  }
  return clone;
}

export function cow(target: Object, key: string, descriptor: Object) {
  const original = descriptor.value;
  descriptor.value = function (...rest) { // eslint-disable-line no-param-reassign, func-names
    const clone = shallowCopy(this);
    Reflect.apply(original, clone, rest);
    return clone;
  };
  return descriptor;
}
*/
