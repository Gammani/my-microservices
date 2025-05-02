import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProfileCommand } from './delete-profile.command';
import { UserRepository } from '../../../user/repositories/user.repository';

@CommandHandler(DeleteProfileCommand)
export class DeleteProfileHandler
  implements ICommandHandler<DeleteProfileCommand>
{
  constructor(private readonly userRepo: UserRepository) {}

  async execute(command: DeleteProfileCommand): Promise<void> {
    const user = await this.userRepo.findById(command.userId);
    if (!user) {
      return;
    }

    await this.userRepo.delete(command.userId);
  }
}
