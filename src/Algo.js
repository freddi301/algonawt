// @flow

import React from 'react';
import { Store } from './Store';
import { machinery } from './reducer';
import { algonawtf } from './algonawtf';

export class Algo<
  State,
  Payloads,
  Action: { type: string, payload: Payloads },
  Handlers: {[key: string]: (state: State, payload: Payloads) => State}
> {
  store: Store<State, Action>;
  actions: $ObjMap<Handlers, <Payload>(p: Payload) => void>;
  constructor(state: State, handlers: Handlers) {
    const { reducer, actions } = machinery(handlers);
    this.store = new Store(state, reducer);
    this.actions = Object.keys(actions).reduce((memo, actionName) => {
      memo[actionName] = payload => this.store.publish((actions[actionName](payload): any));
      return memo;
    }, {});
  }
  nawt<SelectedState>(
    selector: (state: State) => SelectedState,
    WrappedComponent: (props: SelectedState) => React.Element<*>
  ){
    return algonawtf(this.store, selector, WrappedComponent);
  }
}
