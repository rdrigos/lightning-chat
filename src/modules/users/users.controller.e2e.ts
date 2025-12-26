import { Hasher } from '@/core/cryptography/abstract.hasher';
import { GlobalValidationPipe } from '@/infrastructure/http/pipes/global-validation.pipe';
import { CreateUserRequestDTO } from '@/modules/users/dtos/create-user-request.dto';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { faker } from '@faker-js/faker';
import { ClassProvider, HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { FakeHasher } from 'tests/cryptography/hasher';
import { createTestApp } from 'tests/helpers/create-test-app';
import { InMemoryUserRepository } from 'tests/repositories/user.repository';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

const overrides: ClassProvider[] = [
  {
    provide: UserRepository,
    useClass: InMemoryUserRepository,
  },
  {
    provide: Hasher,
    useClass: FakeHasher,
  },
];

describe('Users (E2E)', () => {
  let app: INestApplication;
  let userRepository: UserRepository;

  beforeAll(async () => {
    app = await createTestApp(overrides);
    app.useGlobalPipes(new GlobalValidationPipe());

    userRepository = app.get(UserRepository);

    await app.init();
  });

  beforeEach(() => {
    (userRepository as InMemoryUserRepository).reset();
  });

  it('[POST] /users - success', async () => {
    const payload: CreateUserRequestDTO = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'p@ssW0rd',
    };

    // Sends a POST request to create a new user with the payload
    const response = await request(app.getHttpServer()).post('/users').send(payload);

    // Checks that the response status is 201 Created
    expect(response.statusCode).toBe(HttpStatus.CREATED);

    // Verifies that the response contains an 'id' and does not include the password
    expect(response.body).toHaveProperty('id');
    expect(response.body).not.toHaveProperty('password');

    // Verifies that a user with the given email exists in the repository
    const user = await userRepository.findByEmail(payload.email);
    expect(user).toBeDefined();
  });

  it('[POST] /users - fails on duplicate email', async () => {
    const payload: CreateUserRequestDTO = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'p@ssW0rd',
    };

    // Creates the first user with the given email
    await request(app.getHttpServer()).post('/users').send(payload);

    // Attempts to create the same user again — should trigger a duplicate email error
    const response = await request(app.getHttpServer()).post('/users').send(payload);

    // Asserts that the response is a 409 conflict and the message indicates the email already exists
    expect(response.statusCode).toBe(HttpStatus.CONFLICT);
    expect(response.body.message).toContain('already exists');
  });

  it('[POST] /users - fails on validation error', async () => {
    const payload: CreateUserRequestDTO = {
      name: 'Doe',
      email: 'invalid-email',
      password: 'short',
    };

    // Sends a POST request with invalid data to trigger validation errors
    const response = await request(app.getHttpServer()).post('/users').send(payload);

    // Checks that the response status is 400 Bad Request
    expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);

    // Ensures the response contains an 'errors' array with at least one validation error
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);

    // Verifies that each error object contains 'property' and 'message' properties
    response.body.errors.forEach((error: any) => {
      expect(error).toHaveProperty('property');
      expect(error).toHaveProperty('message');
    });
  });
});
