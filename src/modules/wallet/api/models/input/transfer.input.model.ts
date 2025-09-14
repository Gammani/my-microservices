import { IsUUID, IsString, Matches, IsNotEmpty } from 'class-validator';

export class TransferDto {
  @IsUUID()
  toUserId: string;

  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'amount must have max 2 decimal places',
  })
  @IsNotEmpty()
  amount: string;
}
