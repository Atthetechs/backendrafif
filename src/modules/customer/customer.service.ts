import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyAds } from '../property-ads/entities/property-ads.entity';
import { S3ImageUpload } from '../s3Bucket/s3.service';
import { Customers } from './entities/customer.entity';
import { ContractFiles } from './entities/contractFile.entity';
import { Images } from './entities/images.entity';
// import { Payment } from '../payment_details/entities/payment.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customers) private customerRepo: Repository<Customers>,
    @InjectRepository(PropertyAds) private propertyAd: Repository<PropertyAds>,
    @InjectRepository(ContractFiles)
    private contractRepo: Repository<ContractFiles>,
    @InjectRepository(Images) private imagesRepo: Repository<Images>,
    // @InjectRepository(Payment) private payment: Repository<Payment>,
    @Inject('BUCKET') private readonly bucket: S3ImageUpload,
  ) {}

  async create(data: any, file: any, profile_img: any) {
    try {
      const { property_Id, ...result } = data;
      const propertyAd = await this.propertyAd.findOne({
        where: { id: property_Id },
      });

      if (propertyAd) {
        const response: any = file.length && (await this.bucket.upload(file));

        const profilepic: any =
          profile_img.length &&
          (await this.bucket.singleImageUpload(profile_img[0]));

        const res = new Customers();
        Object.keys(result).forEach((key) => {
          res[`${key}`] =
            key == 'price' ? parseInt(result[`${key}`]) : result[`${key}`];
          res.profile_img = profilepic;
          res.propertyAds = propertyAd;
        });

        const respo = await this.customerRepo.save(res);

        for (let i = 0; i < response.length; i++) {
          const Img = new Images();
          Img.name = response[i].name;
          Img.key = response[i].key;
          Img.customer = respo;
          const res = await this.imagesRepo.save(Img);
          if (Object.keys(res).length) {
            if (response.length == i + 1) {
              return { status: 200, message: 'Customer Created Successfully' };
            }
          }
        }
      } else {
        return { message: 'This Property Not Available' };
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async upload(file: any, id: number) {
    try {
      if (file.length) {
        const customer = await this.customerRepo.findOne({ where: { id } });
        if (customer) {
          const uploadFile = await this.bucket.contractFiles(file);

          if (uploadFile.length)
            for (let i = 0; i < uploadFile.length; i++) {
              const contractRes = new ContractFiles();
              contractRes.name = uploadFile[i].name;
              contractRes.key = uploadFile[i].key;
              contractRes.customer = customer;
              const res = await this.contractRepo.save(contractRes);
              if (Object.keys(res).length) {
                if (uploadFile.length == i + 1) {
                  return { status: 200, message: 'File Uploaded' };
                }
              }
            }
        } else {
          return { status: 400, message: 'Customer Does Not Exist' };
        }
      } else {
        return { status: 400, message: 'Plz Upload File' };
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async updates(user: any, profile_img: any) {
    try {
      const customer = await this.customerRepo.findOne({
        where: { id: user.customer_Id },
      });
      if (customer) {
        const profilepic: any =
          profile_img && (await this.bucket.singleImageUpload(profile_img));

        Object.keys(user).forEach((key: any) => {
          if (user[`${key}`].length) {
            customer[`${key}`] =
              key == 'price' ? parseInt(user[`${key}`]) : user[`${key}`];
            profilepic && (customer.profile_img = profilepic);
          }
        });
        const save = await this.customerRepo.save(customer);
        if (save) {
          return { status: 200, message: 'Profile Updated' };
        }
      } else {
        return { status: 400, message: 'User Not Exist' };
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
