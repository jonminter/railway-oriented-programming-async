import { User, SavedUserAccount } from './user';

export function printValidUser(input: User) {
  console.log('User is valid: ', input);
}

export function printError(errorMessage: string) {
  console.log('User is invalid: ', errorMessage);
}

export function printSavedUser(user: SavedUserAccount) {
  console.log('Saved user ID: ', user.userId);
}
