export class Failure<E, S> {
  public readonly value: E;

  constructor(value: E) {
    this.value = value;
  }

  public isSuccess(): this is Success<E, S> {
    return false;
  }

  public isFailure(): this is Failure<E, S> {
    return true;
  }
}

export class Success<E, S> {
  public readonly value: S;

  constructor(value: S) {
    this.value = value;
  }

  public isSuccess(): this is Success<E, S> {
    return true;
  }

  public isFailure(): this is Failure<E, S> {
    return false;
  }
}

export type Result<E, S> = Failure<E, S> | Success<E, S>;

export const failure = <E, S>(value: E): Result<E, S> => {
  return new Failure(value);
};

export const success = <E, S>(value: S): Result<E, S> => {
  return new Success(value);
};
