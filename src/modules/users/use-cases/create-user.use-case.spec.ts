import { CreateUserDTO } from '@/modules/users/dtos/create-user.dto';
import { UserAlreadyExistsException } from '@/modules/users/exceptions/user-already-exists.exception';
import { CreateUserUseCase } from '@/modules/users/use-cases/create-user.use-case';
import { faker } from '@faker-js/faker';
import { FakeHasher } from 'tests/cryptography/fake-hasher';
import { InMemoryUserRepository } from 'tests/repositories/user.repository';
import { beforeEach, describe, expect, it } from 'vitest';

let fakeHasher: FakeHasher;
let inMemoryUserRepository: InMemoryUserRepository;
let sut: CreateUserUseCase;

describe('Create User', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher();
    inMemoryUserRepository = new InMemoryUserRepository();
    sut = new CreateUserUseCase(fakeHasher, inMemoryUserRepository);
  });

  it('should be able to create a user', async () => {
    const input: CreateUserDTO = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const result = await sut.execute(input);

    // Should return a user with a valid ID (indicating successful creation)
    expect(result.id).toEqual(expect.any(String));

    // The user should actually be persisted in the in-memory repository
    const createdUser = await inMemoryUserRepository.findByEmail(input.email);
    expect(createdUser).toBeDefined();
  });

  it('should hash user password upon registration', async () => {
    const input: CreateUserDTO = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await sut.execute(input);

    // Retrieve the created user and ensure the password is not stored in plain text
    const createdUser = await inMemoryUserRepository.findByEmail(input.email);
    expect(createdUser?.getPassword()).not.toBe(input.password);

    // Verify that the stored password hash matches the original password
    const isPasswordHashed = await fakeHasher.compare(input.password, createdUser!.getPassword());
    expect(isPasswordHashed).toEqual(true);
  });

  it('should not allow creating a user with an existing email', async () => {
    const input: CreateUserDTO = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await sut.execute(input);

    await expect(sut.execute(input)).rejects.toBeInstanceOf(UserAlreadyExistsException);
  });
});
