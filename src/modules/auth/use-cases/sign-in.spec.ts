import { Hasher } from '@/core/cryptography/hasher.abstract';
import { TokenProvider } from '@/core/cryptography/token-provider.abstract';
import { SignInRequest } from '@/modules/auth/dtos/sign-in-request.dto';
import { InvalidCredentialsException } from '@/modules/auth/exceptions/invalid-credentials.exception';
import { SignInUseCase } from '@/modules/auth/use-cases/sign-in.use-case';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { faker } from '@faker-js/faker';
import { FakeHasher } from 'tests/cryptography/hasher';
import { FakeTokenProvider } from 'tests/cryptography/token-provider';
import { makeUser } from 'tests/factories/make-user.factory';
import { InMemoryUserRepository } from 'tests/repositories/user.repository';
import { beforeEach, describe, expect, it } from 'vitest';

let hasher: Hasher;
let tokenProvider: TokenProvider;
let userRepository: UserRepository;
let sut: SignInUseCase;

describe('Sign In', () => {
  beforeEach(() => {
    hasher = new FakeHasher();
    tokenProvider = new FakeTokenProvider();
    userRepository = new InMemoryUserRepository();
    sut = new SignInUseCase(hasher, tokenProvider, userRepository);
  });

  it('it should be possible to authenticate a user', async () => {
    const input: SignInRequest = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const user = makeUser({
      email: input.email,
      password: await hasher.hash(input.password),
    });
    await userRepository.save(user);

    const result = await sut.execute(input);

    console.log({ result });
  });

  it('should not allow signing in with an unregistered email', async () => {
    const input: SignInRequest = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const user = makeUser({
      email: 'johndoe@example.com',
      password: await hasher.hash(input.password),
    });
    await userRepository.save(user);

    await expect(sut.execute(input)).rejects.toBeInstanceOf(InvalidCredentialsException);
  });

  it('should not allow signing in with an invalid password', async () => {
    const input: SignInRequest = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const user = makeUser({
      email: input.email,
      password: await hasher.hash('123456'),
    });
    await userRepository.save(user);

    await expect(sut.execute(input)).rejects.toBeInstanceOf(InvalidCredentialsException);
  });
});
