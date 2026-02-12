import { Hasher } from '@/domain/cryptography/hasher.abstract';
import { EntityMetadata } from '@/domain/entities/entity.abstract';
import { User, UserProps } from '@/modules/users/entities/user.entity';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

export function makeUser(override: Partial<UserProps> = {}, metadata?: EntityMetadata): User {
  return User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    metadata
  );
}

@Injectable()
export class UserFactory {
  constructor(
    private hasher: Hasher,
    private userRepository: UserRepository
  ) {}

  public async make(override: Partial<UserProps> = {}, metadata?: EntityMetadata): Promise<User> {
    const plainPassword = override.password ?? faker.internet.password();

    const user = makeUser(
      {
        name: override.name ?? faker.person.fullName(),
        email: override.email ?? faker.internet.email(),
        password: await this.hasher.hash(plainPassword),
      },
      metadata
    );

    await this.userRepository.save(user);

    return user;
  }
}
