import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';

export class PaymentDTO {
  @ApiProperty()
  @IsNotEmpty()
  property_id: number;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  payment_type: string;

  @ApiProperty({ required: false })
  @IsString()
  bank_name?: string;

  @ApiProperty({ required: false })
  @IsString()
  check_no?: string;

  @ApiProperty({ required: false })
  @IsString()
  link_name?: string;

  @ApiProperty({ required: false })
  @IsString()
  link?: string;
}

export class PaymentUpdate {
  @ApiProperty()
  @IsNotEmpty()
  propert_id: number;

  @ApiProperty({ type: 'number', required: false })
  @IsNumber()
  rent?: number;

  @ApiProperty({ required: false })
  @IsString()
  payment_type?: string;

  @ApiProperty({ required: false })
  @IsString()
  bank_name?: string;

  @ApiProperty({ required: false })
  @IsString()
  check_no?: string;

  @ApiProperty({ required: false })
  @IsString()
  link_name?: string;

  @ApiProperty({ required: false })
  @IsString()
  link?: string;
}
