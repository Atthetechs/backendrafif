import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { PropertyAds } from '../property-ads/entities/property-ads.entity';
import { S3ImageUpload } from '../s3Bucket/s3.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(PropertyAds)
    private propertyRepo: Repository<PropertyAds>,
    @Inject('BUCKET') private readonly bucket: S3ImageUpload,
  ) {}

  async findAll() {
    return await this.userRepo.find();
  }

  async finduser(user: any) {
    try {
      const result = await this.userRepo
        .createQueryBuilder('user')
        .where('user.email = :email', { email: user.email })
        .leftJoinAndSelect('user.propertyAds', 'propertyAds')
        .leftJoinAndSelect('propertyAds.customers', 'customers')
        .leftJoinAndSelect('customers.images', 'images')
        .leftJoinAndSelect('customers.contractFiles', 'contractFiles')
        .leftJoinAndSelect(
          'customers.customer_properties',
          'customer_properties',
        )
        .leftJoinAndSelect('customers.payment_details', 'payment_details')
        .leftJoinAndSelect('customers.Late_payment', 'Late_payment')
        .getOne();

      const allresp: any = await this.userRepo
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.propertyAds', 'propertyAds')
        .leftJoinAndSelect('propertyAds.customers', 'customers')
        .leftJoinAndSelect('customers.images', 'images')
        .leftJoinAndSelect('customers.contractFiles', 'contractFiles')
        .leftJoinAndSelect(
          'customers.customer_properties',
          'customer_properties',
        )
        .leftJoinAndSelect('customers.payment_details', 'payment_details')
        .leftJoinAndSelect('customers.Late_payment', 'Late_payment')
        .getMany();

      return { user: result, alluser: allresp };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userRepo.findOne({ where: { email } });
  }

  async create(createDto: CreateUserDto) {
    try {
      const { username, email, password, phoneNumber } = createDto;
      const hashPassword = await bcrypt.hash(password, 8);
      const userExist = await this.userRepo.findOne({ where: { email } });
      if (userExist) {
        return { message: 'User Already Exist' };
      } else {
        const data = this.userRepo.create({
          username,
          email,
          password: hashPassword,
          phoneNumber,
        });
        const datasave = await this.userRepo.save(data);
        if (!datasave) {
          return { message: 'User Not Saved' };
        } else {
          return datasave;
        }
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(data: any) {
    try {
      const { userId, password, ...result } = data;
      const userExist = await this.userRepo.findOne({
        where: { id: +userId },
      });
      if (userExist) {
        const hashPassword =
          password != undefined
            ? await bcrypt.hash(password, 8)
            : userExist.password;
        const updated = { ...result, password: hashPassword };
        const respo = await this.userRepo.save({ ...userExist, ...updated });
        delete respo.password;
        return respo;
      } else {
        return { status: 400, message: 'User Not Exist' };
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async contract(id: any) {
    try {
      const response = await this.propertyRepo.findOneBy({ id });
      if (response) {
        const { ...result } = response;
        return result;
      } else {
        throw new HttpException('Property Not Exist', HttpStatus.BAD_REQUEST);
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getOne(foldername: any, id: any, res: any) {
    if (id) {
      const readStream = await this.bucket.getUploadedFile(foldername, id);
      readStream.pipe(res);
    } else {
      return { message: 'No Image' };
    }
  }
}
