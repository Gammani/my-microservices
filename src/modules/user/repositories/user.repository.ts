import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { BaseRepository } from '../../../shared/repositories/base.repository';

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
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (searchLoginTerm) {
      queryBuilder.where('user.login ILIKE :search', {
        search: `%${searchLoginTerm}%`,
      });
    }

    queryBuilder
      .orderBy('user.createdAt', sortDirection.toUpperCase() as 'ASC' | 'DESC')
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize);

    return await queryBuilder.getManyAndCount();
  }

  async findById(userId: string): Promise<UserEntity | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
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
      .getOne();
    if (foundUser) {
      return foundUser;
    } else {
      return null;
    }
  }

  async save(newUser: UserEntity): Promise<UserEntity> {
    return await newUser.save();
  }

  async loginIsExist(login: string): Promise<boolean> {
    const foundUser = await this.userRepository.find({
      where: {
        login: login,
      },
    });
    return foundUser.length <= 0;
  }

  async emailIsExist(email: string): Promise<boolean> {
    const foundUser = await this.userRepository.find({
      where: {
        email: email,
      },
    });
    return foundUser.length <= 0;
  }

  async delete(userId: string): Promise<void> {
    await this.userRepository.delete({ id: userId });
  }
}
