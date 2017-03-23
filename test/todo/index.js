// @flow

import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';

import { Algo } from '../../src';
import { computed } from '../../src/computed';

const algo = new Algo({
  todos: ['a', 'b', 'c'],
  counter: 0,
}, {
  push: (state, item: string) => {
    return Object.assign({}, state, { todos: state.todos.concat(item) });
  },
  inc: (state) => {
    return Object.assign({}, state, { counter: state.counter + 1 });
  }
});

algo.store.attachReduxDevToolsChromeExtension();

export const Todos = algo.nawt({
  state: { text: '' },
  countRender: true,
  selector: computed({
    todos: ({ store: { todos } }) => todos,
    text: ({ state: { text } }) => text
  }, ({ todos, text }) => {
    return { todos, push: () => algo.actions.push(text) };
  }),
  component: ({ algo: { todos, push }, state: { text }, setState }) => <div>
    <ul>
      {todos.map(todo=><li key={todo}>{todo}</li>)}
    </ul>
     <input type="text" value={text} onChange={(e: { target: { value: string }}) => setState({ text: String(e.target.value) })}/>
    <input type="button" value="add" onClick={push}/>
  </div>
});

const inc = () => algo.actions.inc();

export const Publish = () => <button onClick={inc}>store.publish()</button>;

ReactDOM.render(
  <div>
    <Todos/>
    <Publish/>
  </div>,
  document.getElementById('root')
);
