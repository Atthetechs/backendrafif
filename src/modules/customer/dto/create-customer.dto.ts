import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNonActiveDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  propertyid: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  active: boolean;

  @ApiProperty({ required: false })
  @IsString()
  grace_days?: string;

  @ApiProperty({ required: false })
  @IsString()
  price?: string;

  @ApiProperty({ required: false })
  @IsString()
  created_at?: string;
}
export class CreateCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  property_Id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  civil_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({ required: false })
  @IsString()
  company_name?: string;

  @ApiProperty({ required: false })
  price?: number;

  @ApiProperty({ required: false })
  @IsString()
  priceInWords?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty({ required: false })
  @IsString()
  phoneNumber?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  mobileNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  grace_days?: string;

  @ApiProperty({ required: false })
  @IsString()
  paci_No: string;

  @ApiProperty({ required: false })
  @IsString()
  created_at?: string;

  @ApiProperty({ required: false })
  @IsString()
  purpose?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Profile Image to upload',
  })
  profile_img: string;

  @ApiProperty({
    isArray: true,
    type: 'string',
    format: 'binary',
    description: 'Image file to upload',
  })
  images: string;
}

export class uploadFile {
  @ApiProperty({
    isArray: true,
    type: 'string',
    format: 'binary',
    description: 'Image file to upload',
  })
  contractFile: string;
}

export class UpdateCustomer {
  @ApiProperty({ required: false })
  @IsString()
  fullname?: string;

  @ApiProperty({ required: false })
  @IsString()
  civil_id?: string;

  @ApiProperty({ required: false })
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsString()
  company_name?: string;

  @ApiProperty({ required: false })
  price?: number;

  @ApiProperty({ required: false })
  @IsString()
  country?: string;

  @ApiProperty({ required: false })
  @IsString()
  gender?: string;

  @ApiProperty({ required: false })
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ required: false })
  @IsString()
  mobileNumber?: string;

  @ApiProperty({ required: false })
  @IsString()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  created_at?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  active?: boolean;

  @ApiProperty({
    required: false,
    type: 'string',
    format: 'binary',
    description: 'Profile Image to upload',
  })
  profile_img?: string;

  // @ApiProperty({
  //   isArray: true,
  //   type: 'string',
  //   format: 'binary',
  //   description: 'Image file to upload',
  // })
  // images: string;
}
