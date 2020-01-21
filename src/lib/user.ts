import { Result } from 'true-myth';
import * as uuid4 from 'uuid/v4';
import { AsyncResult } from './result-helpers';

export enum UserValidationError {
  USERNAME_EMPTY = 'Username cannot be empty!',
  USERNAME_INVALID = 'Username must only contain alphanumeric chars and dashes/underscores!',
  USERNAME_IN_USE = 'Username is not unique!'
}
export enum UserSaveError {
  WRITE_FAILED = 'Failed saving record to database!'
}
export type UserError = UserValidationError | UserSaveError;

export class User {
  constructor(
    readonly username: string,
    readonly firstName: string,
    readonly lastName: string
  ) {}
}

export class SavedUserAccount {
  constructor(readonly userId: string) {}
}

export function validateUsernameNotEmpty(input: User): Result<User, UserError> {
  if (input.username.length === 0) {
    return Result.err(UserValidationError.USERNAME_EMPTY);
  }
  return Result.ok(input);
}

export function validateUsernameHasValidChars(
  input: User
): Result<User, UserError> {
  if (!input.username.match(/^[A-Za-z0-9_-]+$/)) {
    return Result.err(UserValidationError.USERNAME_INVALID);
  }
  return Result.ok(input);
}

export async function validateUsernameIsUnqique(
  input: User
): AsyncResult<User, UserError> {
  // For simulation purposes have a condition where this fails
  if (Math.random() > 0.5) {
    return Promise.resolve(Result.err(UserValidationError.USERNAME_IN_USE));
  }
  return Promise.resolve(Result.ok(input));
}

export async function saveUser(
  input: User
): AsyncResult<SavedUserAccount, UserError> {
  if (Math.random() > 0.5) {
    return Promise.resolve(Result.err(UserSaveError.WRITE_FAILED));
  }
  // Let's pretend we made a call to our user database to save the user and
  //  this is the new user's user ID
  return Promise.resolve(Result.ok(new SavedUserAccount(uuid4())));
}
