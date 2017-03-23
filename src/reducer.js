// @flow

export function machinery<
  State,
  Payloads,
  Struct: {[key: string]: (state: State, payload: Payloads) => State},
  Action: { type: string, payload: Payloads }
>(
  struct: Struct
): {
  reducer: (state: State, action: Action) => State,
  events: $ObjMapi<Struct, <Key, Payload>(key: Key, reducer: (state: State, payload: Payload) => State) => (s: State, p: Payload) => State>,
  actions: $ObjMapi<Struct, <Key, Payload>(key: Key, reducer: (state: State, payload: Payload) => State) => (p: Payload) => { type: Key, payload: Payload }>
} {
  const reducer = (state, { type, payload }) => {
    if (struct[type]) return struct[type](state, payload);
    return state;
  };
  const actions = Object.keys(struct).reduce((actions, actionName) => {
    actions[actionName] = (payload: Payloads) => ({ type: actionName, payload });
    return actions;
  }, {});
  const events = Object.keys(struct).reduce((events, eventName) => {
    events[eventName] = (state: State, payload: Payloads) => reducer(state, { type: eventName, payload });
    return events;
  }, {});
  return { reducer, actions, events };
}
