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

describe('PATCH /profile/settings (Integration)', () => {
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
    userRepository = moduleFixture.get(UserRepository);
    jwtService = moduleFixture.get(JwtService);

    await dataSource.synchronize(true);

    const configService = app.get(ConfigService);
    const passwordAdapter = new PasswordAdapter(configService);
    const passwordHash =
      await passwordAdapter.createPasswordHash('test-password');

    user = await userRepository.create({
      login: 'testuser',
      email: 'test@example.com',
      description: 'original description',
      age: 22,
      createdAt: new Date(),
      passwordHash,
    });

    await userRepository.save(user);

    accessToken = await jwtService.createAccessJWT(user.id);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should update age and description', async () => {
    await request(app.getHttpServer())
      .patch('/profile/settings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        age: 28,
        description: 'Updated description',
      })
      .expect(200);

    const updated = await userRepository.findById(user.id);
    expect(updated).not.toBeNull();

    expect(updated!.age).toBe(28);
    expect(updated!.description).toBe('Updated description');
  });

  it('should update only description', async () => {
    await request(app.getHttpServer())
      .patch('/profile/settings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        description: 'Another description only',
      })
      .expect(200);

    const updated = await userRepository.findById(user.id);
    expect(updated).not.toBeNull();

    expect(updated!.description).toBe('Another description only');
    expect(typeof updated!.age).toBe('number'); // age не должен исчезнуть
  });

  it('should update only age', async () => {
    await request(app.getHttpServer())
      .patch('/profile/settings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        age: 30,
      })
      .expect(200);

    const updated = await userRepository.findById(user.id);
    expect(updated).not.toBeNull();

    expect(updated!.age).toBe(30);
    expect(typeof updated!.description).toBe('string'); // description не должен исчезнуть
  });

  it('should return 401 if token is missing', async () => {
    await request(app.getHttpServer())
      .patch('/profile/settings')
      .send({ age: 99 })
      .expect(401);
  });

  it('should return 400 for invalid age', async () => {
    const res = await request(app.getHttpServer())
      .patch('/profile/settings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ age: 150 }) // больше max
      .expect(400);

    expect(res.body.message).toEqual(
      expect.arrayContaining([
        expect.stringContaining('age must not be greater than 120'),
      ]),
    );
  });

  it('should return 400 for too long description', async () => {
    const longDescription = 'a'.repeat(2000);

    const res = await request(app.getHttpServer())
      .patch('/profile/settings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ description: longDescription })
      .expect(400);

    expect(res.body.message).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          'description must be shorter than or equal to 1000 characters',
        ),
      ]),
    );
  });

  it('should ignore extra fields not in DTO', async () => {
    await request(app.getHttpServer())
      .patch('/profile/settings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        age: 35,
        unknownField: 'should be ignored',
      })
      .expect(200);

    const updated = await userRepository.findById(user.id);
    expect(updated).not.toBeNull();
    expect(updated!.age).toBe(35);
    // @ts-expect-error
    expect(updated!.unknownField).toBeUndefined();
  });
});
