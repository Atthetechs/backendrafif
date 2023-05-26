import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3ImageUpload } from '../s3Bucket/s3.service';
import { PropertyAds } from './entities/property-ads.entity';
import { BuildingFields } from './entities/property-ads-buildingfield.entity';
import { ShopFields } from './entities/property-ads-shopfiled.entity';
import { BuildingRole } from './dto/create-property-ads.dto';
import { ShopeRole } from './dto/create-property-ads.dto';

@Injectable()
export class PropertyAdsService {
  constructor(
    @InjectRepository(PropertyAds)
    private propertyRepo: Repository<PropertyAds>,
    @InjectRepository(BuildingFields)
    private buildingRepo: Repository<BuildingFields>,
    @InjectRepository(ShopFields)
    private shopRepo: Repository<ShopFields>,
    @Inject('BUCKET') private readonly bucket: S3ImageUpload,
  ) {}

  async createProperty(dataa: any, images: any, user: any) {
    try {
      const response: any = images.length
        ? await this.bucket.upload(images)
        : [];

      const data = new PropertyAds();
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
          // url: `${process.env.BACKEND_URL}/user/contractFile/${save.id}`,
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
          label: { name_en: 'Address', name_ar: 'عنوان' },
          name: BuildingRole.Address,
        },
        {
          label: { name_en: 'Area', name_ar: 'منطقة' },
          name: BuildingRole.Area,
        },
      ];
      const shop = [
        {
          label: { name_en: 'Address', name_ar: 'عنوان' },
          name: ShopeRole.Address,
        },
        {
          label: { name_en: 'PaciNo', name_ar: 'باسين' },
          name: ShopeRole.PaciNo,
        },
        {
          label: { name_en: 'Shop No', name_ar: 'رقم المحل' },
          name: ShopeRole.ShopNo,
        },
        {
          label: {
            name_en: 'Area',
            name_ar: 'منطقة',
          },
          name: ShopeRole.Area,
        },
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
}
