import { Result } from 'true-myth';
import { of, pipe } from 'rxjs';
import {
  asyncAndThen,
  convertAsync,
  User,
  validateUsernameNotEmpty,
  validateUsernameHasValidChars,
  validateUsernameIsUnqique,
  saveUser,
  printSavedUser,
  printError,
  UserError,
} from './lib';

const dorothyVaughan = new User('dvaughan', 'Dorothy', 'Vaughan');
of(Result.ok<User, UserError>(dorothyVaughan))
  .pipe(
    asyncAndThen(convertAsync(validateUsernameNotEmpty)),
    asyncAndThen(convertAsync(validateUsernameHasValidChars)),
    asyncAndThen(validateUsernameIsUnqique),
    asyncAndThen(saveUser)
  )
  .toPromise()
  .then(result => {
    result.match({
      Ok: user => printSavedUser(user),
      Err: error => printError(error),
    });
  });
