import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestWithUserId, TokenPayloadType } from '../types/index.types';
import { JwtService } from '../../modules/auth/application/jwt.secret';

@Injectable()
export class JwtAccessTokenGuard extends AuthGuard('jwt') {}

@Injectable()
export class CheckAccessToken {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithUserId>();

    const authHeader = req.headers['authorization'];

    if (typeof authHeader !== 'string') {
      throw new UnauthorizedException();
    }

    const accessToken = authHeader.split(' ')[1];
    if (!accessToken) {
      // throw new UnauthorizedException('Access token missing');
      throw new UnauthorizedException();
    }

    const foundUserByAccessToken: TokenPayloadType | null =
      this.jwtService.verifyAccessToken(accessToken);

    if (!foundUserByAccessToken) {
      // throw new UnauthorizedException('Invalid access token');
      throw new UnauthorizedException();
    }

    req.userId = foundUserByAccessToken.userId;

    return true;
  }
}
