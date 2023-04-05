import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PaymentDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber({ allowInfinity: true })
  customer_id: number;

  @ApiProperty()
  @IsNotEmpty()
  price: number;
}
