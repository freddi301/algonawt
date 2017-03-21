// @flow

export class Store<State, Action: { type: string, payload: * }> {
  state: State;
  reducer: (s: State, a: Action) => State;
  listeners: Set<(store: State) => void> = new Set;
  constructor(state: State, reducer: (s: State, a: Action) => State) {
    this.state = state;
    this.reducer = reducer;
  }
  publish: (a: Action) => void = (action: Action) => {
    this.state = this.reducer(this.state, action);
    for (const listener of this.listeners) listener(this.state);
  }
  subscribe(listener: (store: State) => void) { this.listeners.add(listener); }
  unsubscribe(listener: (store: State) => void) { this.listeners.delete(listener); }
  replaceState(state: State) { this.state = state; }
  replaceReducer(reducer: (s: State, a: Action) => State) { this.reducer = reducer; }
}
