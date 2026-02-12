import { Entity, EntityMetadata } from '@/domain/entities/entity.abstract';

export interface UserProps {
  name: string;
  email: string;
  password: string;
}

export class User extends Entity<UserProps> {
  public getName(): string {
    return this.props.name;
  }

  public setName(value: string): this {
    this.props.name = value;
    this.touch();
    return this;
  }

  public getEmail(): string {
    return this.props.email;
  }

  public setEmail(value: string): this {
    this.props.email = value;
    this.touch();
    return this;
  }

  public getPassword(): string {
    return this.props.password;
  }

  public setPassword(value: string): this {
    this.props.password = value;
    this.touch();
    return this;
  }

  public static create(props: UserProps, metadata?: EntityMetadata): User {
    return new User(props, metadata);
  }
}
