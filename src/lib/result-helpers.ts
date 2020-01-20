import { Result } from 'true-myth';

// Let's create a type alias for a Promise of a Result just to save us some typing
export type AsyncResult<S, E> = Promise<Result<S, E>>;
// ...alias type for our async switch functions
export type AsyncSwitch<S, E> = (input: S) => AsyncResult<S, E>;
// ...and finally an alias for our synchronous switch functions
export type Switch<S, E> = (input: S) => Result<S, E>;

/**
 * Converts synchronous switch functions to async so they can be used in our
 * async function pipeline
 *
 * @param syncSwitch
 */
export function convertAsync<S, E>(
  syncSwitch: Switch<S, E>
): AsyncSwitch<S, E> {
  return async (input: S) => {
    return Promise.resolve(syncSwitch(input));
  };
}
