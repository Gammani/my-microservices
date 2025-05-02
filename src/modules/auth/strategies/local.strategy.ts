import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from '../../user/application/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({ usernameField: 'loginOrEmail' });
  }

  async validate(loginOrEmail: string, password: string): Promise<string> {
    const userId: string | null = await this.userService.validateUser(
      loginOrEmail,
      password,
    );
    if (!userId) {
      throw new UnauthorizedException();
    }
    return userId;
  }
}
