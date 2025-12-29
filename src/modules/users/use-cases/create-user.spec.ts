import { Hasher } from '@/core/cryptography/hasher.abstract';
import { CreateUserRequestDTO } from '@/modules/users/dtos/create-user-request.dto';
import { UserAlreadyExistsException } from '@/modules/users/exceptions/user-already-exists.exception';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { CreateUserUseCase } from '@/modules/users/use-cases/create-user.use-case';
import { faker } from '@faker-js/faker';
import { FakeHasher } from 'tests/cryptography/hasher';
import { InMemoryUserRepository } from 'tests/repositories/user.repository';
import { beforeEach, describe, expect, it } from 'vitest';

let hasher: Hasher;
let userRepository: UserRepository;
let sut: CreateUserUseCase;

describe('Create User', () => {
  beforeEach(() => {
    hasher = new FakeHasher();
    userRepository = new InMemoryUserRepository();
    sut = new CreateUserUseCase(hasher, userRepository);
  });

  it('should be able to create a user', async () => {
    const input: CreateUserRequestDTO = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const result = await sut.execute(input);

    // Should return a user with a valid ID (indicating successful creation)
    expect(result.id).toEqual(expect.any(String));

    // Should not expose the password field in the use case response
    expect(result).not.toHaveProperty('password');

    // The user should actually be persisted in the in-memory repository
    const createdUser = await userRepository.findByEmail(input.email);
    expect(createdUser).toBeDefined();
  });

  it('should hash user password upon registration', async () => {
    const input: CreateUserRequestDTO = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await sut.execute(input);

    // Retrieve the created user and ensure the password is not stored in plain text
    const user = await userRepository.findByEmail(input.email);
    expect(user?.getPassword()).not.toBe(input.password);

    // Verify that the stored password hash matches the original password
    const isPasswordHashed = await hasher.compare(input.password, user!.getPassword());
    expect(isPasswordHashed).toEqual(true);
  });

  it('should not allow creating a user with an existing email', async () => {
    const input: CreateUserRequestDTO = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await sut.execute(input);

    await expect(sut.execute(input)).rejects.toBeInstanceOf(UserAlreadyExistsException);
  });
});
