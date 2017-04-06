// @flow

import React from 'react';
import type { BoxedReducer } from './reducer';
import { functional, classy } from './component';

export class Store<State, Reducers, Boxed: BoxedReducer<State, Reducers>> {
  reducer: Boxed;
  listeners: Set<(store: State) => mixed> = new Set;
  constructor(reducer: Boxed) {
    this.reducer = reducer;
  }
  publish: (f: (r: Boxed) => Boxed) => Boxed = f => {
    this.reducer = f(this.reducer);
    for (const listener of this.listeners) listener(this.reducer.state);
    return this.reducer;
  }
  subscribe(listener: (store: State) => mixed) { this.listeners.add(listener); }
  unsubscribe(listener: (store: State) => mixed) { this.listeners.delete(listener); }
  replaceReducer(reducer: Boxed) { this.reducer = reducer; }
  functional<Props>(component: (state: State) => (props: Props) => React.Element<*>): Class<React.Component<void, Props, void>> {
    return functional(this, component);
  }
  classy<
    DefaultProps, Props, ReactState,
    Component: Class<React.Component<DefaultProps, Props, ReactState> & { ostate: State }>
  >(component: Component): Class<React.Component<DefaultProps, Props, ReactState>> {
    return classy(this, component);
  }
}
