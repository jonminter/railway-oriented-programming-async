import { User, SavedUserAccount, UserError } from './user';

export function printValidUser(input: User) {
  console.log('User is valid: ', input);
}

export function printError(error: UserError) {
  console.log('User is invalid: ', error);
}

export function printSavedUser(user: SavedUserAccount) {
  console.log('Saved user ID: ', user.userId);
}
