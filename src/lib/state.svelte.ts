export function createState<T>(value: T) {
  let thing = $state(value);

  function set(value: T) {
    thing = value;
    return thing;
  }

  return {
    get value() {
      return thing;
    },
    set,
  };
}

export type State<T> = {
  readonly value: T;
  set: (value: T) => T;
};
