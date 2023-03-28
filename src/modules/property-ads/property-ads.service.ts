import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3ImageUpload } from '../s3Bucket/s3.service';
import { PropertyAds } from './entities/property-ads.entity';

@Injectable()
export class PropertyAdsService {
  constructor(
    @InjectRepository(PropertyAds)
    private propertyRepo: Repository<PropertyAds>,
    @Inject('BUCKET') private readonly bucket: S3ImageUpload,
  ) {}

  async createProperty(dataa: any, images: any, user: any) {
    try {
      const response: any = images.length
        ? await this.bucket.upload(images)
        : [];

      const data = new PropertyAds();
      Object.keys(dataa).forEach((key) => {
        data[`${key}`] =
          key == 'price' ? parseInt(dataa[`${key}`]) / 12 : dataa[`${key}`];
        data.images = response;
        data.user = user;
      });
      const save = await this.propertyRepo.save(data);
      if (save) {
        return {
          message: 'Created Successfully',
          property_Id: save.id,
          // url: `${process.env.BACKEND_URL}/user/contractFile/${save.id}`,
        };
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
