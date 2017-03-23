// @flow
/*
import React from 'react';
import { Store } from './Store';
import { shallowEqual } from './utils';

export function algonawtf<StoreState, Action: { type: string, payload: * }, AlgonawtState, Props>(
  store: Store<StoreState, Action>,
  selector: (
    state: StoreState,
    props: Props,
    publish: (a: Action) => void
  ) => AlgonawtState,
  WrappedComponent: (props: AlgonawtState) => React.Element<*>,
  compare: (a: mixed, b: mixed) => boolean = shallowEqual,
): Class<React.Component<void, Props, void>> {
  return class Algonawtf extends React.Component<void, Props, void> {
    props: Props;
    store: Store<StoreState, Action>;
    storeState: AlgonawtState;
    render() { // eslint-disable-next-line no-console
      if (window.countRender) console.count(Algonawtf.displayName);
      return WrappedComponent(this.storeState);
    }
    updateState = state => {
      const nextProps = selector(state, this.props, this.store.publish);
      if (!compare(this.storeState, nextProps)) {
        this.storeState = nextProps;
        this.forceUpdate();
      }
    };
    componentDidMount() { this.store.subscribe(this.updateState); }
    componentWillUnmount() { this.store.unsubscribe(this.updateState); } // eslint-disable-line react/sort-comp
    constructor(props: {}, context: {}) {
      super(props, context);
      this.store = store;
      this.storeState = selector(this.store.state, this.props, this.store.publish);
    }
    WrappedComponent: (props: AlgonawtState) => React.Element<*> = WrappedComponent;
    selector = selector;
    static displayName = `AlgonawtF(${WrappedComponent.displayName || WrappedComponent.name})`;
  };
}
*/
