import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyAds } from '../property-ads/entities/property-ads.entity';
import { S3ImageUpload } from '../s3Bucket/s3.service';
import { Customers } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customers) private customerRepo: Repository<Customers>,
    @InjectRepository(PropertyAds) private propertyAd: Repository<PropertyAds>,
    @Inject('BUCKET') private readonly bucket: S3ImageUpload,
  ) {}

  async create(data: any, file: any, profile_img: any) {
    try {
      const { property_Id, ...result } = data;
      const propertyAd = await this.propertyAd.findOne({
        where: { id: property_Id },
      });

      if (propertyAd) {
        const response: any = file.length ? await this.bucket.upload(file) : [];
        const profilepic: any = profile_img.length
          ? await this.bucket.singleImageUpload(profile_img[0])
          : null;
        const res = new Customers();
        Object.keys(result).forEach((key) => {
          res[`${key}`] = result[`${key}`];
          res.profile_img = profilepic;
          res.images = response;
          res.propertyAds = propertyAd;
        });
        let respo = await this.customerRepo.save(res);
        if (!respo) {
          return { status: 400, message: 'Customer Not Created!' };
        } else {
          return { status: 200, message: 'Customer Created Successfully' };
        }
      } else {
        return { message: 'Plz Create Property' };
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
