import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DataSource, EntityManager } from 'typeorm';
import { UserRepository } from '../../../user/repositories/user.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TransferDto } from '../../api/models/input/transfer.input.model';
import { parseAndCheckAmount } from '../../../../common/utils/validateAmount';

export class TransferMoneyCommand {
  constructor(
    public readonly fromUserId: string,
    public readonly dto: TransferDto,
  ) {}
}

@CommandHandler(TransferMoneyCommand)
export class TransferMoneyHandler
  implements ICommandHandler<TransferMoneyCommand>
{
  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: TransferMoneyCommand): Promise<void> {
    const { amount, toUserId } = command.dto;
    let checkedAmount: number;
    try {
      checkedAmount = parseAndCheckAmount(amount);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Некорректная сумма';
      throw new BadRequestException(message);
    }
    await this.dataSource.transaction(async (manager: EntityManager) => {
      const fromUser = await this.userRepository.findByIdForUpdate(
        command.fromUserId,
        manager,
      );
      const toUser = await this.userRepository.findByIdForUpdate(
        toUserId,
        manager,
      );

      if (!fromUser || !toUser) {
        throw new NotFoundException('Пользователь не найден');
      }

      const fromBalance = parseFloat(fromUser.balance);
      if (fromBalance < checkedAmount) {
        throw new BadRequestException('Недостаточно средств');
      }

      await this.userRepository.updateBalance(
        command.fromUserId,
        checkedAmount,
        'subtract',
        manager,
      );
      await this.userRepository.updateBalance(
        toUserId,
        checkedAmount,
        'add',
        manager,
      );
    });
  }
}
