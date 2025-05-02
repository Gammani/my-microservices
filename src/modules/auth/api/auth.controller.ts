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
import {
  RequestWithUser,
  TokensType,
} from '../../../common/types/index.d.types';
import { GenerateTokensCommand } from '../application/commands/generate-tokens.handler';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registration(@Body() createUserModel: CreateUserModel) {
    await this.commandBus.execute(new CreateUserCommand(createUserModel));
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
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
