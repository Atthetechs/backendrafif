import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3ImageUpload } from '../s3Bucket/s3.service';
import { PropertyAds } from './entities/property-ads.entity';
import { PropertyAdsController } from './property-ads.controller';
import { PropertyAdsService } from './property-ads.service';
import { ShopFields } from './entities/property-ads-shopfiled.entity';
import { BuildingFields } from './entities/property-ads-buildingfield.entity';
import { Customers } from '../customer/entities/customer.entity';
import { Images } from '../customer/entities/images.entity';
import { CustomerProperty } from '../customer/entities/customer-property.entity';
import { PaymentDetailsModule } from '../payment_details/payment_details.module';
import { PropertyOwnerData } from './entities/property-ads-ownerdata.entity';
import { Payment } from '../payment_details/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PropertyAds,
      ShopFields,
      BuildingFields,
      Customers,
      Images,
      Payment,
      CustomerProperty,
      PropertyOwnerData,
    ]),
    MulterModule.register({
      dest: './public',
    }),
    PaymentDetailsModule,
  ],
  controllers: [PropertyAdsController],
  providers: [
    PropertyAdsService,
    JwtService,
    {
      provide: 'BUCKET',
      useClass: S3ImageUpload,
    },
  ],
})
export class PropertyAdsModule {}
