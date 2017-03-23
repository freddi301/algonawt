// @flow

import React from 'react';
import { Store } from './Store';
import { machinery } from './reducer';
import { shallowEqual } from './utils';

export class Algo<
  State,
  Payloads,
  Action: { type: string, payload: Payloads },
  Handlers: {[key: string]: (state: State, payload: Payloads) => State}
> {
  store: Store<State, Action>;
  actions: $ObjMap<Handlers, <Payload>(reducer: (state: State, payload: Payload) => State) => (p: Payload) => void>;
  actionCreators: $ObjMapi<Handlers, <Key, Payload>(key: Key, reducer: (state: State, payload: Payload) => State) => (p: Payload) => { type: Key, payload: Payload }>;
  constructor(state: State, handlers: Handlers) {
    const { reducer, actions } = machinery(handlers);
    this.store = new Store(state, reducer);
    this.actionCreators = actions;
    this.actions = Object.keys(actions).reduce((memo, actionName) => {
      memo[actionName] = (payload: Payloads) => this.store.publish((actions[actionName](payload): any));
      return memo;
    }, {});
  }
  nawt<AlgoState, Props, DefaultProps, ReactState: Object>(arg: {
    selector: ({
      store: State,
      props: Props,
      state: ReactState
    }) => AlgoState,
    component: ({
      props: Props,
      state: ReactState,
      algo: AlgoState,
      setState: (partialState: $Shape<ReactState>) => void
    }) => React.Element<any>,
    defaultProps?: DefaultProps,
    state?: ReactState,
    compare?: (a: mixed, b: mixed) => boolean,
    countRender?: boolean
  }): Class<React.Component<DefaultProps, Props, ReactState>> {
    const { selector, component, compare = shallowEqual,
    defaultProps = ({}: any), state = ({}: any), countRender = false } = arg;
    const store = this.store;
    return class Algonawt extends React.Component<DefaultProps, Props, ReactState> {
      static defaultProps: DefaultProps = defaultProps;
      props: Props;
      state: ReactState;
      store: Store<State, Action>;
      algoState: AlgoState;
      render() { // eslint-disable-next-line no-console
        if (countRender) console.count(Algonawt.displayName);
        return component({
          props: this.props,
          state: this.state,
          algo: this.algoState,
          setState: this.boundSetState
        });
      }
      updateState = (storeState: ?State, reactState: ?ReactState) => {
        const nextAlgoState = selector({
          store: storeState || store.state,
          props: this.props,
          state: reactState || this.state
        });
        if (!compare(this.algoState, nextAlgoState)) {
          this.algoState = nextAlgoState;
          this.forceUpdate();
        }
      };
      componentDidMount() { this.store.subscribe(this.updateState); }
      componentWillUnmount() { this.store.unsubscribe(this.updateState); } // eslint-disable-line react/sort-comp
      constructor(props: Props, context: {}) {
        super(props, context);
        this.store = store;
        this.algoState = selector({
          store: store.state,
          props: this.props,
          state: this.state
        });
      }
      component: ({
        props: Props,
        state: ReactState,
        algo: AlgoState,
        setState: (partialState: $Shape<ReactState>) => void
      }) => React.Element<any> = component;
      selector = selector;
      static displayName = `Algonawt(${component.displayName || component.name})`;
      state = state;
      boundSetState = (partialState: $Shape<ReactState>) => {
        this.setState(partialState);
        this.setState(newState => {
          this.updateState(null, newState);
        });
      }
    };
  }
}
