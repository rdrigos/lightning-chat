import { Hasher } from '@/domain/cryptography/hasher.abstract';
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

    // Asserts that the returned result includes a generated 'id'
    expect(result.id).toEqual(expect.any(String));

    // Asserts that the returned result does not include the password
    expect(result).not.toHaveProperty('password');

    // Asserts that the user was actually saved in the repository
    const createdUser = await userRepository.findByEmail(input.email);
    expect(createdUser).toBeDefined();
  });

  it('should not store the user password in plain text', async () => {
    const input: CreateUserRequestDTO = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await sut.execute(input);

    // Retrieves the user from the repository and asserts that the stored password is not plain text
    const user = await userRepository.findByEmail(input.email);
    expect(user?.getPassword()).not.toBe(input.password);

    // Verifies that the stored password matches the original password when hashed
    const isPasswordHashed = await hasher.compare(input.password, user!.getPassword());
    expect(isPasswordHashed).toEqual(true);
  });

  it('should throw an error when a user with the same email already exists', async () => {
    const input: CreateUserRequestDTO = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await sut.execute(input);

    // Asserts that creating another user with the same email throws a UserAlreadyExistsException
    await expect(sut.execute(input)).rejects.toBeInstanceOf(UserAlreadyExistsException);
  });
});
