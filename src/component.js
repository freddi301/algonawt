// @flow

import React from 'react';

export function functional<State, Props, E: React.Element<*>>(
  observable: {
    subscribe(cb: (s: State) => mixed): mixed,
    unsubscribe(cb: (s: State) => mixed): mixed
  },
  component: (state: State) => (props: Props) => E
): Class<React.Component<void, Props, void>> {
  return class Functional extends React.Component<void, Props, void> {
    props: Props;
    ostate: State;
    render() { if (this.ostate) return component(this.ostate)(this.props); return null; }
    updateObservedState = (state: State) => {
      this.ostate = state;
      this.forceUpdate();
    };
    componentDidMount() { observable.subscribe(this.updateObservedState); }
    componentWillUnmount() { observable.unsubscribe(this.updateObservedState); }
    static displayName = `Functional(${component.name})`;
  };
}

export function classy<
  State, DefaultProps, Props, ReactState,
  Component: Class<React.Component<DefaultProps, Props, ReactState> & { ostate: State }>
>(
  observable: {
    subscribe(cb: (s: State) => mixed): mixed,
    unsubscribe(cb: (s: State) => mixed): mixed
  },
  component: Component,
): Class<React.Component<DefaultProps, Props, ReactState>> {
  return class Classy extends component {
    static defaultProps: $Abstract<DefaultProps>;
    props: Props;
    state: $Abstract<ReactState>;
    ostate: State;
    render() { if (this.ostate) return super.render(); return null; }
    updateObservedState = (state: State) => {
      this.ostate = state;
      this.forceUpdate();
    };
    componentDidMount() {
      observable.subscribe(this.updateObservedState);
      if (super.componentDidMount) super.componentDidMount();
    }
    componentWillUnmount() {
      observable.unsubscribe(this.updateObservedState);
      if (super.componentWillUnmount) super.componentWillUnmount();
    }
    static displayName = `Classy(${component.displayName || component.name})`;
  };
}
