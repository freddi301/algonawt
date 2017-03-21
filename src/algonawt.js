// @flow

import React from 'react';
import { Store } from './Store';
import { shallowEqual } from './utils';

export function algonawt<
  DefaultProps: ?Object,
  Props: Object,
  State: ?Object,
  StoreState,
  Action: { type: string, payload?: mixed },
  AlgonawtState: Object
>(
  store: Store<StoreState, Action>,
  selector: (
    state: StoreState,
    props: Props,
    publish: (a: Action) => void
  ) => AlgonawtState,
  WrappedComponent: Class<React.Component<DefaultProps, Props, State> & { algonawt: AlgonawtState }>,
  compare: (a: mixed, b: mixed) => boolean = shallowEqual
): Class<React.Component<DefaultProps, Props, State>> {
  return class Algonawt extends WrappedComponent {
    static defaultProps: $Abstract<DefaultProps>;
    props: Props;
    state: $Abstract<State>;
    store: Store<StoreState, Action>;
    algonawt: AlgonawtState;
    static displayName = `Algonawt(${WrappedComponent.displayName || WrappedComponent.name})`;
    constructor(props: Props, context: {}) {
      super(props, context);
      this.store = this.props.argo || store;
      this.algonawt = selector(this.store.state, this.props, this.store.publish);
    }
    updateAlgonawtState: (s: StoreState) => void = state => {
      const nextProps = selector(state, this.props, this.store.publish);
      if (!compare(this.algonawt, nextProps)) {
        this.algonawt = nextProps;
        this.forceUpdate();
      }
    };
    componentDidMount() {
      if (super.componentDidMount) super.componentDidMount();
      this.store.subscribe(this.updateAlgonawtState);
    }
    componentWillUnmount() {
      if (super.componentWillUnmount) super.componentWillUnmount();
      this.store.unsubscribe(this.updateAlgonawtState);
    }
  };
}
