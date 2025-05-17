import { UserEntity } from '../../../entity/user.entity';
import { UserDto } from '../user.dto';

describe('UserDto', () => {
  it('должен корректно маппить поля из UserEntity', () => {
    const mockUser = new UserEntity();
    mockUser.id = '123';
    mockUser.login = 'testUser';
    mockUser.email = 'test@example.com';
    mockUser.age = 25;
    mockUser.description = 'Test description';
    mockUser.createdAt = new Date('2023-01-01T00:00:00Z');
    mockUser.passwordHash = 'secure_hash';

    const dto = new UserDto(mockUser);

    expect(dto).toEqual({
      id: '123',
      login: 'testUser',
      email: 'test@example.com',
      age: 25,
      description: 'Test description',
      createdAt: new Date('2023-01-01T00:00:00Z'),
    });

    // Убедимся, что passwordHash не протекает
    expect((dto as any).passwordHash).toBeUndefined();
  });
});
