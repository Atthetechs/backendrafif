import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyAds } from '../property-ads/entities/property-ads.entity';
import { S3ImageUpload } from '../s3Bucket/s3.service';
import { Customers } from './entities/customer.entity';
import { ContractFiles } from './entities/contractFile.entity';
import { Images } from './entities/images.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CustomerProperty } from './entities/customer-property.entity';
import * as moment from 'moment';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customers) private customerRepo: Repository<Customers>,
    @InjectRepository(PropertyAds) private propertyAd: Repository<PropertyAds>,
    @InjectRepository(ContractFiles)
    private contractRepo: Repository<ContractFiles>,
    @InjectRepository(CustomerProperty)
    private customer_property_Repo: Repository<CustomerProperty>,
    @InjectRepository(Images) private imagesRepo: Repository<Images>,
    @Inject('BUCKET') private readonly bucket: S3ImageUpload,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async ExpireCustomer() {
    try {
      const allcustomerData: any = await this.customerRepo
        .createQueryBuilder('customers')
        .getMany();

      if (allcustomerData.length) {
        allcustomerData.forEach(async (el: any) => {
          let createdDate = new Date(JSON.stringify(el.created_at));
          const currentDate = new Date();
          const days = await this.DaysBetweenTwoDates(createdDate, currentDate);
          if (days == 365 || days > 365) {
            await this.customerRepo
              .createQueryBuilder('customers')
              .update()
              .set({ active: false })
              .where('id = :id', { id: el.id })
              .execute();
          }
        });
      }
    } catch (err) {
      return { status: 400, message: 'Expire Customer Error' };
    }
  }

  async DaysBetweenTwoDates(createdDate: any, currentDate: any) {
    try {
      const ONE_DAY = 1000 * 60 * 60 * 24;
      const differenceMs = Math.abs(createdDate - currentDate);
      // Convert back to days and return
      return Math.round(differenceMs / ONE_DAY);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async create(data: any, file: any, profile_img: any) {
    try {
      const { property_Id, grace_days, created_at, ...result } = data;
      const propertyAd = await this.propertyAd.findOne({
        where: { id: property_Id },
      });
      if (propertyAd) {
        const Currentdate = new Date(created_at);
        grace_days?.length &&
          Currentdate.setDate(Currentdate.getDate() + +grace_days);

        const response: any = file.length && (await this.bucket.upload(file));

        const profilepic: any =
          profile_img.length &&
          (await this.bucket.singleImageUpload(profile_img[0]));

        const res: any = new Customers();
        Object.keys(result).forEach((key) => {
          res[`${key}`] =
            key == 'price' ? parseInt(result[`${key}`]) : result[`${key}`];
          res.profile_img = profilepic;
          res.grace_days = grace_days;
          res.contract_date = moment(Currentdate).format('YYYY/MM/DD');
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

  async findAll(
    propertyid: number,
    active: any,
    grace_days: string,
    price: string,
    created_at: string,
  ) {
    try {
      const main = {};
      if (
        grace_days != 'string' &&
        grace_days.length &&
        price != 'string' &&
        price.length &&
        created_at != 'string' &&
        created_at.length
      ) {
        Object.assign(main, { grace_days, price, created_at, active });
      } else {
        Object.assign(main, { active });
      }
      await this.propertyAd
        .createQueryBuilder('propertyAds')
        .update()
        .set({ rented: active })
        .where('id = :id', { id: propertyid })
        .execute();

      const property: any = await this.propertyAd
        .createQueryBuilder('propertyAds')
        .where('propertyAds.id =:id', { id: propertyid })
        .leftJoinAndSelect('propertyAds.customers', 'customers')
        .leftJoinAndSelect(
          'customers.customer_properties',
          'customer_properties',
        )
        .getOne();

      const current = new Date();
      const Currentdate = new Date(created_at?.length ? created_at : current);
      grace_days?.length &&
        Currentdate.setDate(Currentdate.getDate() + +grace_days);

      const { customers } = property;
      if (customers.length) {
        let updatedResult = [];
        for (let i = 0; i < customers.length; i++) {
          const customerProperty = customers[i].customer_properties;
          if (customerProperty.length) {
            for (let x = 0; x < customerProperty.length; x++) {
              await this.customer_property_Repo
                .createQueryBuilder('customer_properties')
                .update()
                .set({ rented: active })
                .where('id = :id', { id: customerProperty[x].id })
                .execute();
              await this.propertyAd
                .createQueryBuilder('propertyAds')
                .update()
                .set({ rented: active })
                .where('id = :id', { id: customerProperty[x].property_id })
                .execute();
            }
          }

          const updateCustomer = await this.customerRepo.findOne({
            where: { id: customers[i].id },
          });
          Object.keys(main).forEach((key) => {
            updateCustomer[`${key}`] =
              key == 'price' ? +main['price'] : main[`${key}`];
            updateCustomer.contract_date =
              moment(Currentdate).format('YYYY/MM/DD');
            updateCustomer.propertyAds = property;
          });
          const save: any = await this.customerRepo.save(updateCustomer);
          if (save) {
            updatedResult.push(1);
          }
        }
        if (updatedResult.length == customers.length)
          return { status: 200, messsage: 'Successfully Updated' };
      } else {
        return { status: 400, messsage: 'Plz Customers Created' };
      }
    } catch (err) {
      throw new HttpException(
        'Error in non-active API',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
