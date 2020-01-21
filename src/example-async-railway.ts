import { Result } from 'true-myth';
import {
  convertAsync,
  AsyncRailway,
  User,
  validateUsernameNotEmpty,
  validateUsernameHasValidChars,
  validateUsernameIsUnqique,
  printValidUser,
  printError,
  UserError,
} from './lib';

const graceHopper = new User('gracehopper', 'Grace', 'Hopper');

AsyncRailway.leaveTrainStation(Result.ok<User, UserError>(graceHopper))
  .andThen(convertAsync(validateUsernameNotEmpty))
  .andThen(convertAsync(validateUsernameNotEmpty))
  .andThen(validateUsernameIsUnqique)
  .arriveAtDestination()
  .then(result => {
    result.match({
      Ok: user => printValidUser(user),
      Err: error => printError(error),
    });
  });
