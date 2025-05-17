import { DeleteProfileHandler } from '../delete-profile.handler';
import { DeleteProfileCommand } from '../delete-profile.command';
import { UserRepository } from '../../../../user/repositories/user.repository';
import { UserEntity } from '../../../../user/entity/user.entity';

describe('DeleteProfileHandler', () => {
  let handler: DeleteProfileHandler;
  let userRepo: jest.Mocked<UserRepository>;

  const userId = 'test-user-id';

  beforeEach(() => {
    userRepo = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as any;

    handler = new DeleteProfileHandler(userRepo);
  });

  it('should not call delete if user not found', async () => {
    userRepo.findById.mockResolvedValue(null);

    await handler.execute(new DeleteProfileCommand(userId));

    expect(userRepo.findById).toHaveBeenCalledWith(userId);
    expect(userRepo.delete).not.toHaveBeenCalled();
  });

  it('should delete user if found', async () => {
    const mockUser: UserEntity = {
      id: userId,
      login: 'john',
      email: 'john@example.com',
      age: 30,
      description: 'test user',
      createdAt: new Date(),
      passwordHash: 'hashed123',
    } as Partial<UserEntity> as UserEntity;

    userRepo.findById.mockResolvedValue(mockUser);

    await handler.execute(new DeleteProfileCommand(userId));

    expect(userRepo.findById).toHaveBeenCalledWith(userId);
    expect(userRepo.delete).toHaveBeenCalledWith(userId);
  });
});
