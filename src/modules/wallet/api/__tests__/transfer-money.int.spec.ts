import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { UserRepository } from '../../../user/repositories/user.repository';
import { UserEntity } from '../../../user/entity/user.entity';
import {
  TransferMoneyCommand,
  TransferMoneyHandler,
} from '../../application/commands/transfer-money.command';
import { AppModule } from '../../../../app.module';

describe('TransferMoneyHandler (integration)', () => {
  let handler: TransferMoneyHandler;
  let dataSource: DataSource;
  let userRepository: UserRepository;

  beforeAll(async () => {
    // Импортируем главный AppModule, DI‑граф инициализируется полностью
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // Через DI получаем handler, репозиторий и dataSource (реальный)
    handler = module.get(TransferMoneyHandler);
    dataSource = module.get(DataSource);
    userRepository = module.get(UserRepository);
  });

  beforeEach(async () => {
    // Очистить базу перед каждым тестом
    await dataSource.synchronize(true);
  });

  it('should transfer money between two users atomically', async () => {
    // 1. Создать двух пользователей
    const sender = await userRepository.save(
      Object.assign(new UserEntity(), {
        login: 'sender',
        email: 'sender@example.com',
        age: 30,
        description: 'Description for sender, at least 25 chars',
        passwordHash: 'hash',
        balance: '100.00',
      }),
    );
    const receiver = await userRepository.save(
      Object.assign(new UserEntity(), {
        login: 'receiver',
        email: 'receiver@example.com',
        age: 30,
        description: 'Description for receiver, at least 25 chars',
        passwordHash: 'hash',
        balance: '10.00',
      }),
    );

    // 2. Провести перевод
    const dto = { toUserId: receiver.id, amount: '60.50' };
    const command = new TransferMoneyCommand(sender.id, dto);

    await handler.execute(command);

    // 3. Проверить новые балансы
    const updatedSender = await userRepository.findById(sender.id);
    const updatedReceiver = await userRepository.findById(receiver.id);

    expect(updatedSender?.balance).toBe('39.50'); // 100.00 - 60.50
    expect(updatedReceiver?.balance).toBe('70.50'); // 10.00 + 60.50
  });

  it('should throw error if not enough money', async () => {
    const sender = await userRepository.save(
      Object.assign(new UserEntity(), {
        login: 'sender2',
        email: 'sender2@example.com',
        age: 30,
        description: 'Description for sender2, at least 25 chars',
        passwordHash: 'hash',
        balance: '10.00',
      }),
    );
    const receiver = await userRepository.save(
      Object.assign(new UserEntity(), {
        login: 'receiver2',
        email: 'receiver2@example.com',
        age: 30,
        description: 'Description for receiver2, at least 25 chars',
        passwordHash: 'hash',
        balance: '0.00',
      }),
    );

    const dto = { toUserId: receiver.id, amount: '20.00' };
    const command = new TransferMoneyCommand(sender.id, dto);

    await expect(handler.execute(command)).rejects.toThrow(
      'Недостаточно средств',
    );
  });
});
