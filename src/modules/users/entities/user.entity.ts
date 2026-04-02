import { Entity, EntityMetadata } from '@/domain/entities/entity.abstract';

interface UserProps {
  name: string;
  email: string;
  password: string;
}

export class User extends Entity<UserProps> {
  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  public static create(props: UserProps, metadata?: EntityMetadata): User {
    return new User(props, metadata);
  }
}
