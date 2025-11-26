import { AppModule } from '@/app.module';
import { Hasher } from '@/core/cryptography/hasher.abstract';
import { RequestValidationPipe } from '@/core/pipes/request-validation.pipe';
import { CreateUserDTO } from '@/modules/users/dtos/create-user.dto';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { faker } from '@faker-js/faker';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { FakeHasher } from 'tests/cryptography/fake-hasher';
import { InMemoryUserRepository } from 'tests/repositories/user.repository';
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';

const overrides = [
  {
    provider: UserRepository,
    useClass: InMemoryUserRepository,
  },
  {
    provider: Hasher,
    useClass: FakeHasher,
  },
];

describe('Users (E2E)', () => {
  let app: INestApplication;
  let userRepository: UserRepository;

  beforeAll(async () => {
    let module = Test.createTestingModule({ imports: [AppModule] });

    for (const override of overrides) {
      module = module.overrideProvider(override.provider).useClass(override.useClass);
    }

    const moduleRef = await module.compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new RequestValidationPipe());

    userRepository = app.get(UserRepository);

    await app.init();
  });

  beforeEach(() => {
    (userRepository as InMemoryUserRepository).reset();
  });

  it('[POST] /users - success', async () => {
    const payload: CreateUserDTO = {
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
    const payload: CreateUserDTO = {
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
    const payload: CreateUserDTO = {
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

    // Verifies that each error object contains 'field' and 'message' properties
    response.body.errors.forEach((err: any) => {
      expect(err).toHaveProperty('field');
      expect(err).toHaveProperty('message');
    });
  });
});
