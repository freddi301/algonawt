// @flow

import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';

import { Store } from '../../src';
import { createReducer } from '../../src';
import { functional } from '../../src';

function fromLocalStorage() {
  const store = localStorage.getItem('store');
  if (store) return JSON.parse(store);
}
function toLocalStorage(state) {
  localStorage.setItem('store', JSON.stringify(state));
}

const store = new Store(fromLocalStorage() || {
  todos: ([]: Array<string>),
  counter: 0,
}, createReducer({
  add: s => todo => ({ ...s, todos: s.todos.concat(todo) }),
  remove: s => index => ({ ...s, todos: s.todos.slice(0, index).concat(s.todos.slice(index + 1)) }),
  inc: s => n => ({ ...s, counter: s.counter + n })
}, {
  afterAction: ({ state }) => toLocalStorage(state)
}));

const inc = base => () => store.publish(r => r.inc(base));
export const Counter = store.functional(({ counter }) =>
  ({ base }) => <button onClick={inc(base)}>{counter}</button>
);

export const Todos = store.classy(class Todos extends React.Component {
  state = { text: '' };
  ostate: typeof store.reducer.state;
  write = (e) => this.setState({ text: e.target.value });
  add = () => store.publish(r => r.add(this.state.text));
  remove = index => () => store.publish(r => r.remove(index));
  render() {
    return <div>
      <ul>
        {this.ostate.todos.map((todo, index) => <li key={todo}>
          {todo}
          <button onClick={this.remove(index)}>x</button>
        </li>)}
      </ul>
      <input type="text" value={this.state.text} onChange={this.write}/>
      <button onClick={this.add}>add</button>
    </div>;
  }
});

import { ReplaySubject } from 'rxjs';

const cs: ReplaySubject<number> = new ReplaySubject;
cs.next(8);
export const RxCounter = functional(cs, (count) => () =>
  <button onClick={() => cs.next(count + 1)}>{count}</button>
);

ReactDOM.render(
  <div>
    <Todos/>
    <Counter base={3}/>
    <RxCounter/>
  </div>,
  document.getElementById('root')
);

store.publish(x=>x);
