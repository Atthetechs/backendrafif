import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3ImageUpload } from '../s3Bucket/s3.service';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customers } from './entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customers])],
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
