import { CreateUserModel } from '../../api/models/input/create.user.model';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../user/repositories/user.repository';
import { PasswordAdapter } from '../../../../shared/adapter/password.adapter';
import { UserEntity } from '../../../user/entity/user.entity';

export class CreateUserCommand {
  constructor(public createUserModel: CreateUserModel) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordAdapter: PasswordAdapter,
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const passwordHash = await this.passwordAdapter.createPasswordHash(
      command.createUserModel.password,
    );
    const createdAt = new Date();

    const newUser = new UserEntity();
    newUser.login = command.createUserModel.login;
    newUser.email = command.createUserModel.email;
    newUser.age = command.createUserModel.age;
    newUser.description = command.createUserModel.description
      ? command.createUserModel.description
      : '';
    newUser.passwordHash = passwordHash;
    newUser.createdAt = createdAt;

    await this.userRepository.save(newUser);
  }
}
