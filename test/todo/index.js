// @flow

import React from 'react'; // eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';

import { Store } from '../../src/Store';
import { algonawtf } from '../../src/algonawtf';
import { computed } from '../../src/computed';
import { machinery } from '../../src/reducer';

const mach = machinery({
  push: (state, item: string) => {
    return { todos: state.todos.concat(item) };
  }
});

const store = new Store(
  {
    todos: ['a', 'b', 'c']
  },
  mach.reducer
);

const Todos = algonawtf( //eslint-disable-line no-unused-vars
  store,
  computed({
    todos: state => state.todos
  }, props => ({
    todos: props.todos,
    push: e => store.publish(mach.actions.push(String(e.target.value)))
  })),
  ({ todos, push }) => <div>
    <ul>
      {todos.map(todo=><li key={todo}>{todo}</li>)}
    </ul>
    <input type="text"/><input type="button" value="add" onClick={push}/>
  </div>
);

ReactDOM.render(
  <Todos></Todos>,
  document.getElementById('root')
);
