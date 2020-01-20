import { Result } from 'true-myth';
import * as uuid4 from 'uuid/v4';
import { AsyncResult } from './result-helpers';

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

export function validateUsernameNotEmpty(input: User): Result<User, string> {
  if (input.username.length === 0) {
    return Result.err('Username cannot be empty!');
  }
  return Result.ok(input);
}

export function validateUsernameHasValidChars(
  input: User
): Result<User, string> {
  if (!input.username.match(/^[A-Za-z0-9_-]+$/)) {
    return Result.err(
      'Username must only contain alphanumeric chars and dashes/underscores'
    );
  }
  return Result.ok(input);
}

export async function validateUsernameIsUnqique(
  input: User
): AsyncResult<User, string> {
  // For simulation purposes have a condition where this fails
  if (input.username.length > 10) {
    return Promise.resolve(Result.err('Username is not unique!'));
  }
  return Promise.resolve(Result.ok(input));
}

export async function saveUser(
  input: User
): AsyncResult<SavedUserAccount, string> {
  // Let's pretend we made a call to our user database to save the user and
  //  this is the new user's user ID
  return Promise.resolve(Result.ok(new SavedUserAccount(uuid4())));
}
