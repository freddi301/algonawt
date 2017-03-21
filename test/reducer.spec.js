// @flow

import { machinery } from '../src/reducer';

const x = machinery({
  a: (s: string, p: number) => s + p,
  b: (s: string, p: { string: string }) => s + p.string,
});

// $ExpectError
const y = x.reducer('', { type: 'b', payload: Date });
(y: string);

const b1 = x.actions.b({ string: '' });
(b1.payload: { string: string });
(b1.type: 'b');
// $ExpectError
(b1.type: 'a');
// $ExpectError
(b1.payload: number);
// $ExpectError
x.actions.b(3);


const a1 = x.actions.a(4);
(a1.type: 'a');
// $ExpectError
(a1.type: 'b');
(a1.payload: number);
// $ExpectError
(a1.payload: { string: string });
// $ExpectError
x.actions.a({ string: 'hello' });
