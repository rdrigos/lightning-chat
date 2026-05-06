import { v7 as uuid } from 'uuid';

export class UniqueEntityID {
  private readonly _value: string;

  constructor(value?: string) {
    this._value = value ?? uuid();
  }

  public toValue(): string {
    return this._value;
  }

  public equals(id: UniqueEntityID): boolean {
    return this.toValue() === id.toValue();
  }
}
