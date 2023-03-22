import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyAds } from './entities/property-ads.entity';
@Module({
  imports: [TypeOrmModule.forFeature([PropertyAds])],
})
export class PropertyAdsModule {}
