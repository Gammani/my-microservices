import { IsUUID, IsString, Matches, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransferDto {
  @ApiProperty({
    description: 'send money to UserId',
    example: '4bb1f308-9773-489f-b2db-6085882311c4',
  })
  @IsUUID()
  toUserId: string;

  @ApiProperty({
    description: 'amount',
    example: '10.50',
  })
  @IsString()
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: 'amount must have max 2 decimal places',
  })
  @IsNotEmpty()
  amount: string;
}
