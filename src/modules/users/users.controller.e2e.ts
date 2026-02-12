import { Hasher } from '@/domain/cryptography/hasher.abstract';
import { CreateUserRequestDTO } from '@/modules/users/dtos/create-user-request.dto';
import { UserRepository } from '@/modules/users/repositories/user.repository';
import { CreateUserUseCase } from '@/modules/users/use-cases/create-user.use-case';
import { UsersController } from '@/modules/users/users.controller';
import { faker } from '@faker-js/faker';
import { HttpStatus } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import request from 'supertest';
import { FakeHasher } from 'tests/cryptography/hasher';
import { createTestApp } from 'tests/helpers/create-test-app';
import { InMemoryUserRepository } from 'tests/repositories/user.repository';
import { beforeAll, describe, expect, it } from 'vitest';

describe('Users (E2E)', () => {
  let app: NestFastifyApplication;
  let userRepository: UserRepository;

  beforeAll(async () => {
    app = await createTestApp({
      controllers: [UsersController],
      providers: [
        CreateUserUseCase,
        {
          provide: UserRepository,
          useClass: InMemoryUserRepository,
        },
        {
          provide: Hasher,
          useClass: FakeHasher,
        },
      ],
    });

    // Recovers container dependencies for use in tests
    userRepository = app.get(UserRepository);
  });

  it('[POST] /users - should create a new user successfully', async () => {
    const payload: CreateUserRequestDTO = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'Pa$$W0rd',
    };

    // Attempt to create the user with
    const response = await request(app.getHttpServer()).post('/users').send(payload);

    // Asserts that the response status is 201
    expect(response.statusCode).toBe(HttpStatus.CREATED);

    // Asserts that the response body contains the user's "id" and does not contain the "password"
    expect(response.body).toHaveProperty('id');
    expect(response.body).not.toHaveProperty('password');

    // Asserts that a user with the specified email exists in the repository
    const user = await userRepository.findByEmail(payload.email);
    expect(user).toBeDefined();
  });

  it('[POST] /users - should not allow creating a user with an existing email', async () => {
    const payload: CreateUserRequestDTO = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'Pa$$W0rd',
    };

    // Creates the first user with the given payload
    await request(app.getHttpServer()).post('/users').send(payload);

    // Attempts to create a second user with the same email
    const response = await request(app.getHttpServer()).post('/users').send(payload);

    // Asserts that the response returns a conflict status and the appropriate error message
    expect(response.statusCode).toBe(HttpStatus.CONFLICT);
    expect(response.body.message).toContain('already exists');
  });

  it('[POST] /users - should fail when payload is invalid', async () => {
    const payload: CreateUserRequestDTO = {
      name: 'Doe',
      email: 'invalid-email',
      password: 'short',
    };

    // Sends a request to create a user with invalid data
    const response = await request(app.getHttpServer()).post('/users').send(payload);

    // Asserts that the response status is 400
    expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);

    // Asserts that the response contains an array of validation errors
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors.length).toBeGreaterThan(0);

    // Asserts that each validation error includes the 'property' and 'message' fields
    response.body.errors.forEach((error: any) => {
      expect(error).toHaveProperty('property');
      expect(error).toHaveProperty('message');
    });
  });
});
