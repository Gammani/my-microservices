import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateProfileCommand } from './update-profile.command';
import { UserRepository } from '../../../user/repositories/user.repository';

@CommandHandler(UpdateProfileCommand)
export class UpdateProfileHandler
  implements ICommandHandler<UpdateProfileCommand>
{
  constructor(private readonly userRepo: UserRepository) {}

  async execute(command: UpdateProfileCommand): Promise<void> {
    const user = await this.userRepo.findById(command.userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (command.dto.age !== undefined) user.age = command.dto.age;
    if (command.dto.description !== undefined)
      user.description = command.dto.description;

    await this.userRepo.save(user);
  }
}
