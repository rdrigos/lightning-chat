import { Entity, EntityMetadata } from '@/domain/entities/abstract.entity';

export interface UserProps {
  name: string;
  email: string;
  password: string;
}

export class User extends Entity<UserProps> {
  public getName(): string {
    return this.props.name;
  }

  public setName(name: string): this {
    this.props.name = name;
    this.touch();
    return this;
  }

  public getEmail(): string {
    return this.props.email;
  }

  public setEmail(email: string): this {
    this.props.email = email;
    this.touch();
    return this;
  }

  public getPassword(): string {
    return this.props.password;
  }

  public setPassword(password: string): this {
    this.props.password = password;
    this.touch();
    return this;
  }

  public static create(props: UserProps, metadata?: EntityMetadata): User {
    return new User(props, metadata);
  }
}
