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
@Module({
  imports: [
    TypeOrmModule.forFeature([PropertyAds, ShopFields, BuildingFields]),
    MulterModule.register({
      dest: './public',
    }),
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
