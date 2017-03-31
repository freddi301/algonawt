// @flow

import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';

import { Store } from '../../src';
import { createReducer } from '../../src';

const store = new Store({
  todos: [],
  counter: 0,
}, createReducer({
  add: s => todo => ({ ...s, todos: s.todos.concat(todo) }),
  inc: s => n => ({ ...s, counter: s.counter + n })
}));

const inc = base => () => store.publish(r => r.inc(base));
export const Counter = store.functional(({ counter }) =>
  ({ base }) => <button onClick={inc(base)}>{counter}</button>
);

export const Todos = store.classy(class Todos extends React.Component {
  state = { text: '' };
  observedState: typeof store.reducer.state;
  write = (e) => this.setState({ text: e.target.value });
  add = () => store.publish(r => r.add(this.state.text));
  render() {
    return <div>
      <ul>
        {this.observedState.todos.map(todo => <li key={todo}>{todo}</li>)}
      </ul>
      <input type="text" value={this.state.text} onChange={this.write}/>
      <button onClick={this.add}>add</button>
    </div>;
  }
});

ReactDOM.render(
  <div>
    <Todos/>
    <Counter base={3}/>
  </div>,
  document.getElementById('root')
);
