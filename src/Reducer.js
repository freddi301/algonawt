// @flow

export type BoxedReducer<State, Reducers> = $ObjMap<Reducers, <A>(r: (s: State) => (...a: A) => State) => (...a: A) => BoxedReducer<State, Reducers>> & { state: State };

export function createReducer<
  State,
  Reducers: {[key: string]: (state: State) => (...args: any) => State}
>(
  reducers: Reducers
): (state: State) => BoxedReducer<State, Reducers> {
  const ret = { };
  Object.keys(reducers).forEach(key => {
    ret[key] = function (...args) {
      return Object.create(ret, { state: { value: reducers[key](this.state)(...args) } });
    };
  });
  return state => (Object.create(ret, { state: { value: state } }): any);
}
