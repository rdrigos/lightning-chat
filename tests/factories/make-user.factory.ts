import { UniqueEntityID } from '@/domain/entities/value-objects/unique-entity-id.vo';
import { User, UserProps } from '@/modules/users/entities/user.entity';
import { faker } from '@faker-js/faker';

export function makeUser(override: Partial<UserProps> = {}, id?: UniqueEntityID): User {
  const user = User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    {
      id: id,
    }
  );

  return user;
}
