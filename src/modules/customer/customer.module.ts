import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyAds } from '../property-ads/entities/property-ads.entity';
import { S3ImageUpload } from '../s3Bucket/s3.service';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customers } from './entities/customer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customers, PropertyAds]),
    MulterModule.register({
      dest: './public',
    }),
  ],
  controllers: [CustomerController],
  providers: [
    CustomerService,
    {
      provide: 'BUCKET',
      useClass: S3ImageUpload,
    },
  ],
})
export class CustomerModule {}
