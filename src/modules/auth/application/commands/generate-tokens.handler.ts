import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '../jwt.secret';
import { TokensType } from '../../../../common/types/index.types';

export class GenerateTokensCommand {
  constructor(public userId: string) {}
}

@CommandHandler(GenerateTokensCommand)
export class GenerateTokensHandler
  implements ICommandHandler<GenerateTokensCommand>
{
  constructor(private readonly jwtService: JwtService) {}

  async execute(command: GenerateTokensCommand): Promise<TokensType> {
    const accessToken = await this.jwtService.createAccessJWT(command.userId);
    const refreshToken = await this.jwtService.createRefreshJWT(command.userId);

    return {
      accessToken,
      refreshToken,
    };
  }
}
