import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3ImageUpload } from '../s3Bucket/s3.service';
import { PropertyAds } from './entities/property-ads.entity';
import { BuildingFields } from './entities/property-ads-buildingfield.entity';
import { ShopFields } from './entities/property-ads-shopfiled.entity';
import { BuildingRole, UpdateProperty } from './dto/create-property-ads.dto';
import { ShopeRole } from './dto/create-property-ads.dto';
import { Customers } from '../customer/entities/customer.entity';
import { Images } from '../customer/entities/images.entity';
import { CustomerProperty } from '../customer/entities/customer-property.entity';
import * as moment from 'moment';
import { PaymentDetailsService } from '../payment_details/payment_details.service';

@Injectable()
export class PropertyAdsService {
  constructor(
    @InjectRepository(PropertyAds)
    private propertyRepo: Repository<PropertyAds>,
    @InjectRepository(Customers)
    private customerRepo: Repository<Customers>,
    @InjectRepository(BuildingFields)
    private buildingRepo: Repository<BuildingFields>,
    @InjectRepository(ShopFields)
    private shopRepo: Repository<ShopFields>,
    @InjectRepository(Images) private imagesRepo: Repository<Images>,
    @InjectRepository(CustomerProperty)
    private customer_property_Repo: Repository<CustomerProperty>,
    @Inject('BUCKET') private readonly bucket: S3ImageUpload,
    @Inject(PaymentDetailsService)
    private readonly paymentUpdate: PaymentDetailsService,
  ) {}

  async createProperty(dataa: any, images: any, user: any) {
    try {
      const response: any = images.length
        ? await this.bucket.upload(images)
        : [];

      const data: any = new PropertyAds();
      Object.keys(dataa).forEach((key) => {
        data[`${key}`] = dataa[`${key}`];
        data.images = response;
        data.user = user;
      });

      const save = await this.propertyRepo.save(data);
      if (save) {
        return {
          message: 'Created Successfully',
          property_Id: save.id,
        };
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(name: any, repo: any) {
    try {
      const respo = await repo.find({
        where: { property_type: name },
      });
      return respo;
    } catch (err) {
      console.log(err);
    }
  }

  async createFiled(repo: any, name: any, data: any) {
    try {
      const final = JSON.stringify(data);
      if (name == 'building') {
        await repo
          .createQueryBuilder()
          .insert()
          .into(BuildingFields)
          .values([
            {
              property_type: name,
              fields: final,
            },
          ])
          .execute();
      } else {
        await repo
          .createQueryBuilder()
          .insert()
          .into(ShopFields)
          .values([
            {
              property_type: name,
              fields: final,
            },
          ])
          .execute();
      }
    } catch (err) {
      console.log(err);
    }
  }

  async find() {
    try {
      const building = [
        {
          label: { name_en: 'Building Name', name_ar: 'اسم المبنى' },
          name: BuildingRole.building_name,
        },
        {
          label: { name_en: 'Address', name_ar: 'عنوان' },
          name: BuildingRole.Address,
        },
        {
          label: { name_en: 'PaciNo', name_ar: 'باسين' },
          name: BuildingRole.PaciNo,
        },
        {
          label: {
            name_en: 'Area m²',
            name_ar: 'المساحة م2',
          },
          name: BuildingRole.Area,
        },
        {
          label: { name_en: 'Plot No', name_ar: 'القطعة رقم' },
          name: BuildingRole.plot_No,
        },
      ];
      const shop = [
        // {
        //   label: { name_en: 'Address', name_ar: 'عنوان' },
        //   name: ShopeRole.Address,
        // },
        {
          label: { name_en: 'Shop No', name_ar: 'رقم المحل' },
          name: ShopeRole.ShopNo,
        },
        {
          label: {
            name_en: 'Area m²',
            name_ar: 'المساحة م2',
          },
          name: ShopeRole.Area,
        },
        {
          label: { name_en: 'PaciNo', name_ar: 'باسين' },
          name: ShopeRole.PaciNo,
        },
        // {
        //   label: { name_en: 'Plot No', name_ar: 'القطعة رقم' },
        //   name: BuildingRole.plot_No,
        // },
      ];
      const arrayname = [
        {
          name: 'building',
          repo: this.buildingRepo,
          data: building,
        },
        {
          name: 'shop',
          repo: this.shopRepo,
          data: shop,
        },
      ];

      const alldata = [];
      for (let i = 0; i < arrayname.length; i++) {
        const response = await this.findAll(
          arrayname[i].name,
          arrayname[i].repo,
        );
        if (response.length == 0) {
          await this.createFiled(
            arrayname[i].repo,
            arrayname[i].name,
            arrayname[i].data,
          );
          const resp = await this.findAll(arrayname[i].name, arrayname[i].repo);
          alldata.push(resp[0]);
        } else {
          alldata.push(response[0]);
        }
      }
      if (alldata?.length == arrayname.length) {
        return alldata;
      } else {
        throw new HttpException('Error', HttpStatus.BAD_REQUEST);
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(body: UpdateProperty) {
    try {
      const property = await this.propertyRepo.findOne({
        where: { id: +body.property_id },
      });
      if (property) {
        await this.propertyRepo.delete({ id: +body.property_id });

        const customerUpdate: any = await this.customerRepo.findOne({
          where: { id: +body.customer_id },
        });

        const res: any = new PropertyAds();
        Object.keys(property).forEach((key) => {
          res[`${key}`] = property[`${key}`];
          res.customers = customerUpdate;
        });

        await this.propertyRepo.save(res);

        const result = await this.customerRepo.update(
          { id: +body.customer_id },
          { price: +body.rent },
        );
        if (result.affected) {
          return { status: 200, message: 'Update Property' };
        } else {
          return { status: 400, message: 'Error Update Property' };
        }
      }
    } catch (err) {
      throw new HttpException(
        'Error in Code updateProperty',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createCustomer(id: number, data: any, images: any, profileImg: any) {
    try {
      const { property_Id, grace_days, contract_year, ...result } = data;
      id && (await this.propertyRepo.update({ id }, { rented: true }));
      const enter_this_property = await this.propertyRepo.findOne({
        where: { id },
      });

      const properties = property_Id && JSON.parse(property_Id);
      const allproperty = properties.length && properties[0];

      if (
        Object.keys(enter_this_property).length ||
        enter_this_property != undefined ||
        enter_this_property != null
      ) {
        const Currentdate = new Date(data.created_at);
        grace_days?.length &&
          Currentdate.setDate(Currentdate.getDate() + +grace_days);
        const ExpireDate = new Date(Currentdate);
        contract_year?.length &&
          ExpireDate.setFullYear(ExpireDate.getFullYear() + +contract_year);

        const response: any =
          images.length && (await this.bucket.upload(images));
        const profilepic: any =
          profileImg.length &&
          (await this.bucket.singleImageUpload(profileImg[0]));

        const res: any = new Customers();

        Object.keys(result).forEach((key) => {
          res[`${key}`] =
            key == 'price' ? parseInt(result[`${key}`]) : result[`${key}`];
          res.profile_img = profilepic;
          res.grace_days = grace_days;
          res.contract_date = moment(Currentdate).format('YYYY/MM/DD');
          res.expire_date = moment(ExpireDate).format('YYYY/MM/DD');
          res.propertyAds = enter_this_property;
        });

        const respo = await this.customerRepo.save(res);

        for (let i = 0; i < response.length; i++) {
          const Img = new Images();
          Img.name = response[i].name;
          Img.key = response[i].key;
          Img.customer = respo;
          await this.imagesRepo.save(Img);
        }

        if (allproperty.length || data.price) {
          const enter_this = await this.propertyRepo.findOne({
            where: { id },
          });
          if (allproperty.length) {
            const propRes = new CustomerProperty();
            for (let y = 0; y < allproperty.length; y++) {
              await this.propertyRepo.update(
                { id: +allproperty[y] },
                { rented: true },
              );
              const property = await this.propertyRepo.findOne({
                where: { id: +allproperty[y] },
              });
              for (let x = 0; x < enter_this.customers.length; x++) {
                await this.customerRepo.update(
                  { id: enter_this.customers[x].id },
                  {
                    contract_date: moment(Currentdate).format('YYYY/MM/DD'),
                    expire_date: moment(ExpireDate).format('YYYY/MM/DD'),
                    created_at: data.created_at,
                    price: data.price,
                  },
                );
                const customer = await this.customerRepo.findOne({
                  where: { id: enter_this.customers[x].id },
                });
                Object.keys(property).forEach((key) => {
                  propRes[`${key}`] = property[`${key}`];
                  propRes[`property_id`] = property['id'];
                  propRes.customer = customer;
                });
                await this.customer_property_Repo.save(propRes);
              }
              if (y + 1 == allproperty.length) {
                await this.paymentUpdate.PaymentUpdate(property_Id);
                return {
                  status: 200,
                  message: 'Create Customer And ADD Property Successfully',
                };
              }
            }
          } else {
            for (let y = 0; y < enter_this.customers.length; y++) {
              await this.customerRepo.update(
                { id: enter_this.customers[y].id },
                {
                  contract_date: moment(Currentdate).format('YYYY/MM/DD'),
                  expire_date: moment(ExpireDate).format('YYYY/MM/DD'),
                  created_at: data.created_at,
                  price: data.price,
                },
              );
              if (y + 1 == enter_this.customers.length) {
                await this.paymentUpdate.PaymentUpdate(property_Id);
                return {
                  status: 200,
                  message: 'Create Customer And Update Others Successfully',
                };
              }
            }
          }
        } else {
          return { status: 200, message: 'Create Customer Successfully' };
        }
      } else {
        return { status: 400, message: 'Main Property Not Found' };
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
