// @flow

export class Store<State, Action: { type: string, payload: any }> {
  state: State;
  reducer: (s: State, a: Action) => State;
  listeners: Set<(store: State) => void> = new Set;
  constructor(state: State, reducer: (s: State, a: Action) => State) {
    this.state = state;
    this.reducer = reducer;
  }
  publish: (a: Action) => void = (action: Action) => {
    const nextState = this.reducer(this.state, action);
    this.state = nextState;
    for (const listener of this.listeners) listener(this.state);
  }
  subscribe(listener: (store: State) => void) { this.listeners.add(listener); }
  unsubscribe(listener: (store: State) => void) { this.listeners.delete(listener); }
  replaceState(state: State) { this.state = state; }
  replaceReducer(reducer: (s: State, a: Action) => State) { this.reducer = reducer; }
  attachReduxDevToolsChromeExtension() {  // eslint-disable-next-line no-underscore-dangle
    if (window.__REDUX_DEVTOOLS_EXTENSION__) { // eslint-disable-next-line no-underscore-dangle
      const devStore = window.__REDUX_DEVTOOLS_EXTENSION__(this.reducer, this.state);
      const originalPublish = this.publish;
      this.publish = (a) => {
        devStore.dispatch(a);
        originalPublish(a);
      };
    }
  }
}
