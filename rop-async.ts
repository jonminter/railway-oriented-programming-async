import { Result } from 'true-myth';
import { Err } from 'true-myth/result';
import {
    of,
    OperatorFunction,
    pipe,
} from 'rxjs';
import { flatMap } from 'rxjs/operators';

class User {
    constructor(
        readonly username: string,
        readonly firstName: string,
        readonly lastName: string,
    ) {}
}

function validateUsernameNotEmpty(input: User): Result<User, string> {
    if (input.username.length === 0) {
        return Result.err('Username cannot be empty!');
    }
    return Result.ok(input);
}

function validateUsernameHasValidChars(input: User): Result<User, string> {
    if (!input.username.match(/^[A-Za-z0-9_-]+$/)) {
        return Result.err('Username must only contain alphanumeric chars and dashes/underscores');
    }
    return Result.ok(input);
}

function printValidUser(input: User) {
    console.log('User is valid: ', input);
}

function printError(errorMessage: string) {
    console.log('User is invalid: ', errorMessage);
}

const newUser = new User('', 'Jon', 'Minter');
// Result.ok<User, string>(newUser)
//     .andThen(validateUsernameNotEmpty)
//     .andThen(validateUsernameHasValidChars)
//     .match({
//         Ok: user => printValidUser(user),
//         Err: errorMsg => printError(errorMsg),
//     });

// Let's create a type alias for a Promise of a Result just to save us some typing
type AsyncResult<S, E> = Promise<Result<S, E>>;
// ...alias type for our async switch functions
type AsyncSwitch<S,E> = (input: S) => AsyncResult<S, E>;
// ...and finally an alias for our synchronous switch functions
type Switch<S, E> = (input: S) => Result<S, E>;

function convertAsync<S, E>(syncSwitch: Switch<S, E>): AsyncSwitch<S, E> {
    return async (input: S) => {
        return Promise.resolve(syncSwitch(input));
    }
}

class AsyncRailway<S,E> {
    private switches: Array<AsyncSwitch<S, E>> = [];
    constructor(private readonly input: Result<S, E>) {}

    static leaveTrainStation<S,E>(input: Result<S, E>) {
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
                ? await nextSwitch(previousResult.value)
                : previousResult;
        }, Promise.resolve(this.input));
    }
}

function sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
}

async function validateUsernameIsUnqique(input: User): AsyncResult<User, string> {
    await sleep(1000);
    // return Promise.resolve(Result.err('Username is not unique!'));
    return Promise.resolve(Result.ok(input));
}


const someUser = new User('someuser', 'Some', 'User');

// AsyncRailway.leaveTrainStation(Result.ok<User, string>(someUser))
//     .andThen(convertAsync(validateUsernameNotEmpty))
//     .andThen(convertAsync(validateUsernameNotEmpty))
//     .andThen(validateUsernameIsUnqique)
//     .arriveAtDestination()
//     .then(result => {
//         result.match({
//             Ok: user => printValidUser(user),
//             Err: errMsg => printError(errMsg)
//         });
//     });


type AsyncSwitchTransform<I, O, E> = (input: I) => AsyncResult<O, E>;
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

class SavedUserAccount {
    constructor(readonly userId:string) {}
}

async function saveUser(input: User): AsyncResult<SavedUserAccount, string> {
    // Let's pretend we made a call to our user database to save the user and
    //  this is the new user's user ID
    return Promise.resolve(
        Result.ok(new SavedUserAccount('ee2dadae-f70f-4cd4-b0a3-0d03d779118f')));
}

function printSavedUser(user: SavedUserAccount) {
    console.log("Saved user ID: ", user.userId);
}

const johnPublic = new User('john', 'John', 'Public');
of(Result.ok(johnPublic))
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
            Err: errMsg => printError(errMsg)
        });
    });