// src/modules/profile/api/__tests__/profile.delete.integration.spec.ts
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

describe('DELETE /profile/delete (Integration)', () => {
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

    dataSource = app.get(DataSource);
    jwtService = moduleFixture.get(JwtService);
    userRepository = moduleFixture.get(UserRepository);

    await dataSource.synchronize(true);

    const configService = app.get(ConfigService);
    const passwordAdapter = new PasswordAdapter(configService);
    const passwordHash = await passwordAdapter.createPasswordHash('password');

    user = await userRepository.create({
      login: 'deletetest',
      email: 'delete@test.com',
      age: 40,
      description: 'Delete me',
      createdAt: new Date(),
      passwordHash,
    });
    await userRepository.save(user);

    accessToken = await jwtService.createAccessJWT(user.id);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should delete the user and return 204', async () => {
    await request(app.getHttpServer())
      .delete('/profile/delete')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);

    const foundUser = await userRepository.findById(user.id);
    expect(foundUser).toBeNull();
  });

  it('should return 401 if no token is provided', async () => {
    await request(app.getHttpServer()).delete('/profile/delete').expect(401);
  });

  it('should return 204 if user already deleted', async () => {
    // Повторный запрос с тем же токеном — пользователь уже удалён
    await request(app.getHttpServer())
      .delete('/profile/delete')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204); // даже если юзер не найден — это не ошибка
  });
});
