import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export enum BuildingRole {
  Address = 'address',
  Area = 'area',
  PaciNo = 'paci_No',
  plot_No = 'plot_No',
  building_name = 'building_name',
  number_of_floor = 'number_of_floor',
}

export enum ShopeRole {
  Area = 'area',
  ShopNo = 'shop_No',
  PaciNo = 'paci_No',
  floor_no = 'floor_No',
  // Address = 'address',
  // plot_No = 'plot_No',
}

export enum UserRole {
  Building = 'building',
  Shop = 'shop',
}

export class CreatePropertyDto {
  @ApiProperty({ required: false })
  @IsString()
  customerId?: string;

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
  plot_No?: string;

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

export class UpdateProperty {
  @ApiProperty()
  @IsString()
  property_id: string;

  @ApiProperty()
  @IsString()
  customer_id: string;

  @ApiProperty()
  @IsString()
  rent: string;
}

export class CreateCustomer {
  @ApiProperty({ isArray: true, required: false })
  @IsString({ each: true })
  property_Id?: string[];

  @ApiProperty({ required: false })
  // @IsNotEmpty()
  @IsString()
  fullname?: string;

  @ApiProperty({ required: false })
  // @IsNotEmpty()
  @IsString()
  civil_id?: string;

  @ApiProperty({ required: false })
  // @IsNotEmpty()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsString()
  company_name?: string;

  @ApiProperty({ required: false })
  price?: number;

  @ApiProperty({ required: false })
  @IsString()
  priceInWords?: string;

  @ApiProperty({ required: false })
  // @IsNotEmpty()
  @IsString()
  country?: string;

  @ApiProperty({ required: false })
  // @IsNotEmpty()
  @IsString()
  gender?: string;

  @ApiProperty({ required: false })
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ required: false })
  // @IsNotEmpty()
  @IsString()
  mobileNumber?: string;

  @ApiProperty({ required: false })
  // @IsNotEmpty()
  @IsString()
  email?: string;

  @ApiProperty({ required: false })
  @IsString()
  grace_days?: string;

  @ApiProperty({ required: false })
  @IsString()
  contract_year?: string;

  @ApiProperty({ required: false })
  @IsString()
  paci_No?: string;

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
    required: false, /// tody add external
  })
  profile_img?: string;

  @ApiProperty({
    isArray: true,
    type: 'string',
    format: 'binary',
    description: 'Image file to upload',
    required: false, /// tody add external
  })
  images?: string;
}
