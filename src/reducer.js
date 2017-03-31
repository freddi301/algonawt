// @flow

export type BoxedReducer<State, Reducers> = $ObjMap<Reducers, <A>(r: (s: State) => (...a: A) => State) => (...a: A) => BoxedReducer<State, Reducers>> & { state: State };

export function createReducer<
  State,
  Reducers: {[key: string]: (state: State) => (...args: any) => State}
>(
  reducers: Reducers,
  options: ?{
    beforeAction?: ({ type: $Keys<Reducers>, payload: Array<mixed>, state: State }) => void,
    afterAction?: ({ type: $Keys<Reducers>, payload: Array<mixed>, state: State }) => void
  }
): (state: State) => BoxedReducer<State, Reducers> {
  const ret = { };
  Object.keys(reducers).forEach(key => {
    ret[key] = function (...args) {
      if (options && options.beforeAction) {
        options.beforeAction({ type: key, payload: args, state: this.state });
      }
      const nextBox = Object.create(ret, { state: { value: reducers[key](this.state)(...args) } });
      if (options && options.afterAction) {
        options.afterAction({ type: key, payload: args, state: nextBox.state });
      }
      return nextBox;
    };
  });
  return state => (Object.create(ret, { state: { value: state } }): any);
}
