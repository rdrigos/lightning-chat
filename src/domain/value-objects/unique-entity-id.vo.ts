import { v7 as uuid } from 'uuid';

export class UniqueEntityId {
  private readonly _value: string;

  constructor(value?: string) {
    this._value = value ?? uuid();
  }

  public toValue(): string {
    return this._value;
  }

  public toString(): string {
    return this._value;
  }

  public equals(other: UniqueEntityId): boolean {
    return this.toValue() === other.toValue();
  }
}
