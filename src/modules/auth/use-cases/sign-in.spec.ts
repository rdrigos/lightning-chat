import { Hasher } from '@/domain/cryptography/hasher.abstract';
import { TokenProvider } from '@/domain/cryptography/token-provider.abstract';
import { SignInRequestDTO } from '@/modules/auth/dtos/sign-in-request.dto';
import { InvalidCredentialsException } from '@/modules/auth/exceptions/invalid-credentials.exception';
import { SessionRepository } from '@/modules/auth/repositories/session.repository';
import { SignInUseCase } from '@/modules/auth/use-cases/sign-in.use-case';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { faker } from '@faker-js/faker';
import { FakeHasher } from 'tests/cryptography/hasher';
import { FakeTokenProvider } from 'tests/cryptography/token-provider';
import { makeUser } from 'tests/factories/make-user';
import { InMemorySessionRepository } from 'tests/repositories/session.repository';
import { InMemoryUserRepository } from 'tests/repositories/user.repository';
import { beforeEach, describe, expect, it } from 'vitest';

let hasher: Hasher;
let tokenProvider: TokenProvider;
let sessionRepository: SessionRepository;
let userRepository: UserRepository;
let sut: SignInUseCase;

describe('Sign In', () => {
  beforeEach(() => {
    hasher = new FakeHasher();
    tokenProvider = new FakeTokenProvider();
    sessionRepository = new InMemorySessionRepository();
    userRepository = new InMemoryUserRepository();
    sut = new SignInUseCase(hasher, tokenProvider, userRepository, sessionRepository);
  });

  it('should successfully sign in a user', async () => {
    const input: SignInRequestDTO = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    // Persist a user with a hashed password
    const user = makeUser({
      email: input.email,
      password: await hasher.hash(input.password),
    });
    await userRepository.save(user);

    // Attempt to authenticate the user
    const result = await sut.execute(input, {});

    // Authentication should return a valid access token and expiration time
    expect(result).toEqual({
      token: expect.any(String),
      expiresIn: expect.any(Number),
    });
  });

  it('should throw InvalidCredentialsException when user does not exist', async () => {
    const input: SignInRequestDTO = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    // authentication should fail with invalid credentials
    await expect(sut.execute(input, {})).rejects.toBeInstanceOf(InvalidCredentialsException);
  });

  it('should throw InvalidCredentialsException when password is invalid', async () => {
    const input: SignInRequestDTO = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 8 }),
    };

    // Persist a user with a different (correct) password
    const user = makeUser({
      email: input.email,
      password: await hasher.hash('Pa$$w0rd'),
    });
    await userRepository.save(user);

    // Authentication should fail with invalid credentials
    await expect(sut.execute(input, {})).rejects.toBeInstanceOf(InvalidCredentialsException);
  });
});
