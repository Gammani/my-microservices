// src/modules/profile/api/__tests__/profile.me.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../../app.module';
import { DataSource } from 'typeorm';
import { JwtService } from '../../../../shared/jwt/jwt.service';
import { UserRepository } from '../../../user/repositories/user.repository';
import { UserEntity } from '../../../user/entity/user.entity';
import { PasswordAdapter } from '../../../../shared/adapter/password.adapter';
import { ConfigService } from '@nestjs/config';

describe('GET /profile/me (Integration)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let jwtService: JwtService;
  let userRepository: UserRepository;

  let accessToken: string;
  let user: UserEntity;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    // Зависимости
    dataSource = app.get(DataSource);
    userRepository = moduleFixture.get(UserRepository);
    jwtService = moduleFixture.get(JwtService);

    await dataSource.synchronize(true);

    // 🛠️ ConfigService fix
    const configService = app.get(ConfigService);
    const passwordAdapter = new PasswordAdapter(configService);
    const passwordHash =
      await passwordAdapter.createPasswordHash('test-password');

    user = await userRepository.create({
      login: 'testuser',
      email: 'test@example.com',
      description: 'Hello world',
      age: 25,
      createdAt: new Date(),
      passwordHash,
    });
    await userRepository.save(user);

    accessToken = await jwtService.createAccessJWT(user.id);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return user profile for valid accessToken', async () => {
    const res = await request(app.getHttpServer())
      .get('/profile/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(res.body).toEqual({
      id: user.id,
      login: user.login,
      email: user.email,
      age: user.age,
      description: user.description,
      createdAt: expect.any(String),
    });
  });

  it('should return 401 if no token provided', async () => {
    await request(app.getHttpServer()).get('/profile/me').expect(401);
  });
});
