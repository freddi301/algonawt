// @flow

import React from 'react';
import type { BoxedReducer } from './Reducer';

export class Store<State, Reducers, Boxed: BoxedReducer<State, Reducers>> {
  reducer: Boxed;
  listeners: Set<(store: State) => void> = new Set;
  constructor(state: State, reducer: (s: State) => Boxed) {
    this.reducer = reducer(state);
  }
  publish: (f: (r: Boxed) => Boxed) => Boxed = f => {
    this.reducer = f(this.reducer);
    for (const listener of this.listeners) listener(this.reducer.state);
    return this.reducer;
  }
  subscribe(listener: (store: State) => void) { this.listeners.add(listener); }
  unsubscribe(listener: (store: State) => void) { this.listeners.delete(listener); }
  replaceReducer(reducer: Boxed) { this.reducer = reducer; }
  functional<Props>(
    component: (state: State) => (props: Props) => React.Element<*>
  ): Class<React.Component<void, Props, void>> {
    const store = this;
    return class Functional extends React.Component<void, Props, void> {
      props: Props;
      observedState: State = store.reducer.state;
      render() { return component(this.observedState)(this.props); }
      updateObservedState = (state: State) => {
        this.observedState = state;
        this.forceUpdate();
      };
      componentDidMount() { store.subscribe(this.updateObservedState); }
      componentWillUnmount() { store.unsubscribe(this.updateObservedState); }
      static displayName = `Functional(${component.name})`;
    };
  }
  classy<
    DefaultProps, Props, ReactState,
    Component: Class<React.Component<DefaultProps, Props, ReactState> & { observedState: State }>
  >(
    component: Component,
  ): Class<React.Component<DefaultProps, Props, ReactState>> {
    const store = this;
    return class Classy extends component {
      static defaultProps: $Abstract<DefaultProps>;
      props: Props;
      state: $Abstract<ReactState>;
      observedState: State = store.reducer.state;
      updateObservedState = (state: State) => {
        this.observedState = state;
        this.forceUpdate();
      };
      componentDidMount() {
        store.subscribe(this.updateObservedState);
        if (super.componentDidMount) super.componentDidMount();
      }
      componentWillUnmount() {
        store.unsubscribe(this.updateObservedState);
        if (super.componentWillUnmount) super.componentWillUnmount();
      }
      static displayName = `Classy(${component.displayName || component.name})`;
    };
  }
}
