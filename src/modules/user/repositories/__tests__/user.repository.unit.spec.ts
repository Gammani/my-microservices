import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../repositories/user.repository';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entity/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let typeOrmRepo: jest.Mocked<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            createQueryBuilder: jest.fn(),
            find: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    typeOrmRepo = module.get(getRepositoryToken(UserEntity));
  });

  describe('findWithPagination', () => {
    it('должен вызывать queryBuilder с правильными параметрами', async () => {
      const mockQueryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest
          .fn()
          .mockResolvedValue([[{ id: '1' } as UserEntity], 1]),
      };

      (typeOrmRepo.createQueryBuilder as jest.Mock).mockReturnValue(
        mockQueryBuilder,
      );

      const result = await userRepository.findWithPagination({
        searchLoginTerm: 'john',
        sortDirection: 'asc',
        pageNumber: 1,
        pageSize: 10,
      });

      // 🔍 Проверки
      expect(typeOrmRepo.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'user.login ILIKE :search',
        { search: '%john%' },
      );
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'user.createdAt',
        'ASC',
      );
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(0);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(result).toEqual([[{ id: '1' }], 1]);
    });
  });
});
