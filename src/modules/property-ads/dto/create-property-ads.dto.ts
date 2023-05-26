import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export enum BuildingRole {
  Address = 'address',
  Area = 'area',
}

export enum ShopeRole {
  Area = 'area',
  ShopNo = 'shop_No',
  PaciNo = 'paci_No',
  Address = 'address',
}

export enum UserRole {
  Building = 'building',
  Shop = 'shop',
}

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
  civil_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  propertytype: string;

  @ApiProperty({ required: false })
  @IsString()
  area?: string;

  @ApiProperty({ required: false })
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsString()
  building_name?: string;

  @ApiProperty({ required: false })
  @IsString()
  shop_No?: string;

  @ApiProperty({ required: false })
  @IsString()
  paci_No?: string;

  @ApiProperty({
    isArray: true,
    type: 'string',
    format: 'binary',
    description: 'Image file to upload',
  })
  images: string;
}
