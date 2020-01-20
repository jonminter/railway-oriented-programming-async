import { Result } from 'true-myth';
import { AsyncSwitch, AsyncResult } from './result-helpers';

export class AsyncRailway<S, E> {
  private switches: Array<AsyncSwitch<S, E>> = [];
  constructor(private readonly input: Result<S, E>) {}

  static leaveTrainStation<S, E>(input: Result<S, E>) {
    return new AsyncRailway(input);
  }

  andThen(switchFunction: AsyncSwitch<S, E>) {
    this.switches.push(switchFunction);
    return this;
  }

  async arriveAtDestination(): AsyncResult<S, E> {
    return this.switches.reduce(async (previousPromise, nextSwitch) => {
      const previousResult = await previousPromise;
      return previousResult.isOk()
        ? nextSwitch(previousResult.value)
        : previousResult;
    }, Promise.resolve(this.input));
  }
}
