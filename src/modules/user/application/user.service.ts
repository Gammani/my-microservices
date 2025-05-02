import { Injectable } from '@nestjs/common';
import { PasswordAdapter } from '../../../shared/adapter/password.adapter';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    protected passwordAdapter: PasswordAdapter,
    protected userRepository: UserRepository,
  ) {}
  async validateUser(
    loginOrEmail: string,
    password: string,
  ): Promise<string | null> {
    const user: UserEntity | null =
      await this.userRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!user) return null;

    const isHashesEquals: any = await this.passwordAdapter.isPasswordCorrect(
      password,
      user.passwordHash,
    );
    if (isHashesEquals) {
      return user.id;
    } else {
      return null;
    }
  }

  async loginIsExist(login: string): Promise<boolean> {
    return await this.userRepository.loginIsExist(login);
  }
  async emailIsExist(email: string): Promise<boolean> {
    return await this.userRepository.emailIsExist(email);
  }
  async emailIsValid(email: string): Promise<boolean> {
    return await this.userRepository.emailIsValid(email);
  }
}
