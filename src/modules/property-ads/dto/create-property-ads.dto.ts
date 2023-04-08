import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePropertyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  owner_name: string;

  @ApiProperty({ required: false })
  @IsString()
  owner_father_name?: string;

  @ApiProperty({ required: false, default: null })
  @IsString()
  phoneNumber?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  owner_address: string;

  @ApiProperty({ required: false })
  @IsString()
  owner_company?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nationality_Id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  propertytype: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  area: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  block_No: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  plot_No: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  building_No: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  street_No: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  town: string;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    isArray: true,
    type: 'string',
    format: 'binary',
    description: 'Image file to upload',
  })
  images: string;
}
