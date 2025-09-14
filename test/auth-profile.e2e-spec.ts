import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CreateUserModel } from '../src/modules/auth/api/models/input/create.user.model';
import { AppModule } from '../src/app.module';
import { applyAppSettings } from '../src/common/utils/apply-app-setting';
import { TestingUtilsService } from '../src/common/utils/testing-utils.service';
import { TestingUtilsModule } from '../src/common/utils/testing-utils.module';

let app: INestApplication;
let accessToken: string;
let refreshToken: string;
const userDto: CreateUserModel = {
  login: 'testuser',
  password: '123456',
  email: 'test@example.com',
  age: 25,
  description: 'Just a test user with a many many many many many many words',
};

let testingUtilsService: TestingUtilsService;

describe('Auth & Profile E2E (flow)', () => {
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestingUtilsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    applyAppSettings(app); // 👈 ВАЖНО! подключаем все нужные настройки, включая useContainer

    testingUtilsService = moduleFixture.get(TestingUtilsService);
    await testingUtilsService.clearDatabase();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Register - should create a new user', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(userDto)
      .expect(204);
  });

  it('Login - should return access and refresh tokens', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        loginOrEmail: userDto.login,
        password: userDto.password,
      })
      .expect(200);

    expect(response.body).toHaveProperty('accessToken');

    const setCookieHeader = response.headers['set-cookie'];
    expect(setCookieHeader).toBeDefined();

    accessToken = response.body.accessToken;

    if (Array.isArray(setCookieHeader)) {
      refreshToken = setCookieHeader
        .find((cookie: string) => cookie.startsWith('refreshToken'))
        ?.split(';')[0]
        ?.split('=')[1];
    } else if (typeof setCookieHeader === 'string') {
      if (setCookieHeader.startsWith('refreshToken')) {
        refreshToken = setCookieHeader.split(';')[0]?.split('=')[1];
      }
    }

    expect(accessToken).toBeTruthy();
    expect(refreshToken).toBeTruthy();
  });

  it('Get Profile - should return current user profile', async () => {
    const response = await request(app.getHttpServer())
      .get('/profile/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toMatchObject({
      login: userDto.login,
      email: userDto.email,
    });
  });

  it('Update Profile - should update user profile', async () => {
    const updateDto = {
      description: 'Hello World!',
      age: 30,
    };

    await request(app.getHttpServer())
      .patch('/profile/settings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateDto)
      .expect(200);

    const response = await request(app.getHttpServer())
      .get('/profile/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toMatchObject(updateDto);
  });

  it('Delete Profile - should delete the user', async () => {
    await request(app.getHttpServer())
      .delete('/profile/delete')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);
  });

  it('Get Profile after deletion - should fail with 401', async () => {
    await request(app.getHttpServer())
      .get('/profile/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(401);
  });
});
