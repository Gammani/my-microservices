import { Injectable } from '@nestjs/common';
import { EntityManager, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { BaseRepository } from '../../../shared/repositories/base.repository';
import { ContentEntity } from '../../content/entity/content.entity';

@Injectable()
export class UserRepository extends BaseRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository);
  }

  async findWithPagination({
    searchLoginTerm,
    sortDirection = 'asc',
    pageNumber = 1,
    pageSize = 10,
  }: {
    searchLoginTerm?: string;
    sortDirection: 'asc' | 'desc';
    pageNumber: number;
    pageSize: number;
  }): Promise<[UserEntity[], number]> {
    const queryBuilder: SelectQueryBuilder<UserEntity> =
      this.userRepository.createQueryBuilder('user');

    if (searchLoginTerm) {
      queryBuilder.where('user.login ILIKE :search', {
        search: `%${searchLoginTerm}%`,
      });
    }

    queryBuilder
      .andWhere('user.deletedAt IS NULL')
      .orderBy('user.createdAt', sortDirection.toUpperCase() as 'ASC' | 'DESC')
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize);

    return await queryBuilder.getManyAndCount();
  }

  async findById(userId: string): Promise<UserEntity | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .andWhere('user.deletedAt IS NULL')
      .getOne();
  }

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserEntity | null> {
    const foundUser: UserEntity | null = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :loginOrEmail OR user.login = :loginOrEmail', {
        loginOrEmail,
      })
      .andWhere('user.deletedAt IS NULL')
      .getOne();
    if (foundUser) {
      return foundUser;
    } else {
      return null;
    }
  }

  async foundUserWithAvatar(accountId: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { id: accountId },
      relations: ['avatarContent'], // << ВАЖНО: подгружаем аватарку!
    });
  }

  async save(newUser: UserEntity): Promise<UserEntity> {
    return await newUser.save();
  }

  async attachAvatar(
    user: UserEntity,
    content: ContentEntity,
  ): Promise<UserEntity> {
    user.avatarContent = content;
    return await this.userRepository.save(user);
  }

  async loginIsExist(login: string): Promise<boolean> {
    const foundUser = await this.userRepository.find({
      where: {
        login: login,
        deletedAt: IsNull(),
      },
    });
    return foundUser.length <= 0;
  }

  async emailIsExist(email: string): Promise<boolean> {
    const foundUser = await this.userRepository.find({
      where: {
        email: email,
        deletedAt: IsNull(),
      },
    });
    return foundUser.length <= 0;
  }

  async findByIdForUpdate(
    userId: string,
    manager: EntityManager,
  ): Promise<UserEntity | null> {
    return manager
      .getRepository(UserEntity)
      .createQueryBuilder('user')
      .setLock('pessimistic_write')
      .where('user.id = :id', { id: userId })
      .andWhere('user.deletedAt IS NULL')
      .getOne();
  }

  async updateBalance(
    userId: string,
    amount: number,
    op: 'add' | 'subtract',
    manager: EntityManager,
  ): Promise<void> {
    await manager
      .getRepository(UserEntity)
      .createQueryBuilder()
      .update()
      .set({ balance: () => `"balance" ${op === 'add' ? '+' : '-'} :amount` })
      .where('id = :id', { id: userId, amount })
      .execute();
  }

  async delete(userId: string): Promise<void> {
    await this.userRepository.softDelete({ id: userId });
  }

  async restore(userId: string): Promise<void> {
    await this.userRepository.restore({ id: userId });
  }

  async hardDelete(userId: string): Promise<void> {
    await this.userRepository.delete({ id: userId });
  }
}
