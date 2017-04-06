// @flow

type ActionCreators<State, Reducers> = $ObjMapi<Reducers, <Key, Payload>(k: Key, r: (...a: Payload) =>  (s: State) => State) => (...a: Payload) => { type: Key, payload: Payload }>;

export type BoxedReducer<State, Reducers> = {
    state: State,
    setState: (state: State) => BoxedReducer<State, Reducers>,
    reducers: Reducers,
    actionCreators: ActionCreators<State, Reducers>,
    reducer: (state: State, action: { type: $Keys<Reducers>, payload: any }) => State,
    seq: (instructions: Array<(r: BoxedReducer<State, Reducers>) => BoxedReducer<State, Reducers>>) => BoxedReducer<State, Reducers>,
    seqr: (instructions: Array<(state: State) => State>) => State,
  } & $ObjMap<Reducers, <A>(r: (...a: A) => (s: State) => State) => (...a: A) => BoxedReducer<State, Reducers>>;

export function createReducer<
  State,
  Reducers: {[key: string]: (...args: any) => (state: State) => State}
>(
  reducers: Reducers,
): (state: State) => BoxedReducer<State, Reducers> {
  const ret = {
    setState(state: State) { return (Object.create(ret, { state: { value: state } }): any); },
    actionCreators: (Object.keys(reducers).reduce((memo, type) => {
      memo[type] = (...payload) => ({ type, payload });
      return memo;
    }, {}): ActionCreators<State, Reducers>),
    reducer: (state: State, action: { type: $Keys<Reducers>, payload: any }) => reducers[action.type](action.payload)(state),
    seq(instructions: Array<(r: BoxedReducer<State, Reducers>) => BoxedReducer<State, Reducers>>): BoxedReducer<State, Reducers> {
      return instructions.reduce((reducer, instruction) => instruction(reducer), this);
    },
    seqr(instructions: Array<(state: State) => State>): State {
      return instructions.reduce((state, instruction) => instruction(state), this.state);
    }
  };
  Object.keys(reducers).forEach(key => {
    ret[key] = function (...args) {
      return Object.create(ret, { state: { value: reducers[key](...args)(this.state) } });
    };
  });
  return state => (Object.create(ret, { state: { value: state } }): any);
}
