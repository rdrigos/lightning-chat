import { v7 as uuid } from 'uuid';

export class UniqueEntityID {
  private readonly value: string;

  constructor(value?: string) {
    this.value = value ?? uuid();
  }

  public toValue(): string {
    return this.value;
  }

  public equals(id: UniqueEntityID) {
    return id.toValue() === this.value;
  }
}
