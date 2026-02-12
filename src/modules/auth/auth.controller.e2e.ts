import { Hasher } from '@/domain/cryptography/hasher.abstract';
import { TokenProvider } from '@/domain/cryptography/token-provider.abstract';
import { AuthController } from '@/modules/auth/auth.controller';
import { SessionRepository } from '@/modules/auth/repositories/session.repository';
import { SignInUseCase } from '@/modules/auth/use-cases/sign-in.use-case';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';
import { FakeHasher } from 'tests/cryptography/hasher';
import { FakeTokenProvider } from 'tests/cryptography/token-provider';
import { UserFactory } from 'tests/factories/make-user';
import { createTestApp } from 'tests/helpers/create-test-app';
import { InMemorySessionRepository } from 'tests/repositories/session.repository';
import { InMemoryUserRepository } from 'tests/repositories/user.repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { SignInRequestDTO } from './dtos/sign-in-request.dto';

describe('Auth (E2E)', () => {
  let app: NestFastifyApplication;
  let userFactory: UserFactory;
  let sessionRepository: SessionRepository;

  beforeEach(async () => {
    app = await createTestApp({
      controllers: [AuthController],
      providers: [
        SignInUseCase,
        UserFactory,
        {
          provide: Hasher,
          useClass: FakeHasher,
        },
        {
          provide: TokenProvider,
          useClass: FakeTokenProvider,
        },
        {
          provide: SessionRepository,
          useClass: InMemorySessionRepository,
        },
        {
          provide: UserRepository,
          useClass: InMemoryUserRepository,
        },
      ],
    });

    // Recovers container dependencies for use in tests
    userFactory = app.get(UserFactory);
    sessionRepository = app.get(SessionRepository);
  });

  it('[POST] /auth/sign-in - should sign in successfully with valid credentials', async () => {
    const payload: SignInRequestDTO = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    // Creates a user with the correct credentials for authentication
    const user = await userFactory.make(payload);

    // Attempts to log in with the user's credentials
    const response = await request(app.getHttpServer()).post('/auth/sign-in').send(payload);

    // Asserts that the response status is 204
    expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);

    // Asserts that no response body is returned
    expect(response.body).toEqual({});

    // Asserts that a cookie named "token" was set in the response headers
    expect(response.headers['set-cookie']).toEqual(expect.arrayContaining([expect.stringContaining('token=')]));

    // Checks that a session was created for the user after sign-in
    const sessions = await sessionRepository.findByUserId(user.getId().toValue());
    expect(sessions).toHaveLength(1);
  });

  it('[POST] /auth/sign-in - should fail when email does not exist', async () => {
    const payload: SignInRequestDTO = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    // attempts to log in with a non-existent email address
    const response = await request(app.getHttpServer()).post('/auth/sign-in').send(payload);

    // Asserts that the response status is 401
    expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);

    // Asserts that no cookie is set in the response since authentication failed
    expect(response.headers['set-cookie']).toBeUndefined();
  });

  it('[POST] /auth/sign-in - should fail when password is incorrect', async () => {
    const payload: SignInRequestDTO = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    // Create the user with the correct credentials
    await userFactory.make({
      email: payload.email,
      password: 'Pa$$W0rd',
    });

    // Attempts to sign in using the correct email but an incorrect password
    const response = await request(app.getHttpServer()).post('/auth/sign-in').send(payload);

    // Asserts that the response status is 401
    expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);

    // Asserts that no cookie is set in the response since authentication failed
    expect(response.headers['set-cookie']).toBeUndefined();
  });
});
