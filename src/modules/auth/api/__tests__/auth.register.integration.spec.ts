// src/modules/auth/api/__tests__/auth.register.integration.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../../app.module';
import { DataSource } from 'typeorm';
import { UserRepository } from '../../../user/repositories/user.repository';
import { applyAppSettings } from '../../../../config/apply-app-setting'; // 👈 импортируем applyAppSettings

describe('POST /auth/register (Integration)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    applyAppSettings(app); // 👈 ВАЖНО! подключаем все нужные настройки, включая useContainer

    await app.init();

    dataSource = app.get(DataSource);
    userRepository = moduleFixture.get(UserRepository);

    await dataSource.synchronize(true); // очистим БД перед тестами
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a new user and return 204', async () => {
    const userDto = {
      login: 'integration_user',
      email: 'integration_user@example.com',
      password: 'testpassword123',
      age: 28,
      description: 'Test registration',
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(userDto)
      .expect(204); // NO CONTENT

    const userInDb = await userRepository.findUserByLoginOrEmail(userDto.email);

    expect(userInDb).toBeDefined();
    expect(userInDb?.login).toBe(userDto.login);
    expect(userInDb?.age).toBe(userDto.age);
  });

  it('should return 400 if email is missing', async () => {
    const badDto = {
      login: 'fail_user',
      password: '12345678',
      age: 20,
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(badDto)
      .expect(400);
  });
});
