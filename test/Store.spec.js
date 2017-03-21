// @flow

import { Store } from '../src/Store';

const store = new Store(
  { x: 5 },
  (state, x: { payload: number }) => {
    (x.payload: number);
    (state.x: number);
    // $ExpectError
    (state.x: string);
    return state;
  }
);

store.subscribe(state => {
  (state.x: number);
  // $ExpectError
  (state.x: string);
});

const r = store.reducer({ x: 4 }, { type: 'hello', payload: 6 });
(r: { x: number });
