import { Result } from 'true-myth';
import { Err } from 'true-myth/result';
import { AsyncResult } from './result-helpers';
import { of, OperatorFunction, pipe } from 'rxjs';
import { flatMap } from 'rxjs/operators';

export type AsyncSwitchTransform<I, O, E> = (input: I) => AsyncResult<O, E>;

/**
 * Handles chaining async function calls that transform from one type to another
 * @param mapFunc
 */
export function asyncAndThen<I, O, E>(
  mapFunc: AsyncSwitchTransform<I, O, E>
): OperatorFunction<Result<I, E>, Result<O, E>> {
  return pipe(
    flatMap(x => {
      return x.isOk() ? mapFunc(x.value) : of(x as Err<any, E>); // tslint:disable-line
    })
  );
}
