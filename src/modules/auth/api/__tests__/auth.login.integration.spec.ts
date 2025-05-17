import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../user/application/user.service';
import { UserRepository } from '../../../user/repositories/user.repository';
import { PasswordAdapter } from '../../../../shared/adapter/password.adapter';
import { DataSource } from 'typeorm';
import { AppModule } from '../../../../app.module';
import { LocalStrategy } from '../../strategies/local.strategy';

describe('Auth login (Integration)', () => {
  let userService: UserService;
  let userRepository: UserRepository;
  let passwordAdapter: PasswordAdapter;
  let localStrategy: LocalStrategy;
  let dataSource: DataSource;

  const testUser = {
    login: 'int_user',
    email: 'int_user@example.com',
    password: 'password123',
    age: 25,
    description: 'Integration test user',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    userService = moduleFixture.get(UserService);
    userRepository = moduleFixture.get(UserRepository);
    passwordAdapter = moduleFixture.get(PasswordAdapter);
    localStrategy = moduleFixture.get(LocalStrategy);
    dataSource = moduleFixture.get(DataSource);

    await dataSource.synchronize(true); // очистка БД

    const hash = await passwordAdapter.createPasswordHash(testUser.password);
    await userRepository.create({
      login: testUser.login,
      email: testUser.email,
      passwordHash: hash,
      age: testUser.age,
      description: testUser.description,
      createdAt: new Date(),
    });
  });

  it('✅ should validate user by login and return userId', async () => {
    const userId = await localStrategy.validate(
      testUser.login,
      testUser.password,
    );

    expect(userId).toBeDefined();
    expect(typeof userId).toBe('string');
  });

  it('✅ should validate user by email and return userId', async () => {
    const userId = await localStrategy.validate(
      testUser.email,
      testUser.password,
    );

    expect(userId).toBeDefined();
    expect(typeof userId).toBe('string');
  });

  it('❌ should throw UnauthorizedException for invalid password', async () => {
    await expect(
      localStrategy.validate(testUser.login, 'wrongpass'),
    ).rejects.toThrow('Unauthorized');
  });

  it('❌ should throw UnauthorizedException for invalid login/email', async () => {
    await expect(
      localStrategy.validate('not_existing_user', testUser.password),
    ).rejects.toThrow('Unauthorized');
  });
});
