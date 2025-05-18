import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateUserModel } from './models/input/create.user.model';
import { CreateUserCommand } from '../application/commands/create-user.handler';
import { LocalAuthGuard } from '../../../common/gurad/local-auth.guard';
import { RequestWithUser, TokensType } from '../../../common/types/index.types';
import { GenerateTokensCommand } from '../application/commands/generate-tokens.handler';
import { ThrottlerGuard } from '@nestjs/throttler';
import { SwaggerRegistrationEndpoint } from '../../../common/decorators/swagger/registration-endpoint.decorator';
import { SwaggerLoginEndpoint } from '../../../common/decorators/swagger/login-endpoint.decorator';
import { AuthInputModel } from './models/input/auth.input.model';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  @SwaggerRegistrationEndpoint()
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() createUserModel: CreateUserModel) {
    await this.commandBus.execute(new CreateUserCommand(createUserModel));
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @SwaggerLoginEndpoint()
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() authInputModel: AuthInputModel,
    @Req() req: RequestWithUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens: TokensType = await this.commandBus.execute(
      new GenerateTokensCommand(req.user),
    );

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: false,
      secure: false,
    });
    return { accessToken: tokens.accessToken };
  }
}
