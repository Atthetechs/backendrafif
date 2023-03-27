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
      const res = await this.userRepo
        .createQueryBuilder('user')
        .where('user.email =:email', { email: user.email })
        .leftJoinAndSelect('user.propertyAds', 'propertyAds')
        .leftJoinAndSelect('propertyAds.customers', 'customers')
        .getOne();
      return res;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userRepo.findOne({ where: { email: email.toLowerCase() } });
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


  async contract(id: any, res: any) {
    try {
      const response = await this.propertyRepo.findOneBy({ id });
      console.log(response);
      if (response) {
        const { customers, ...result } = response;
        return res.render('index', result);
      } else {
        return res.render('error');
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getOne(id: any, res: any) {
    if (id) {
      const readStream = await this.bucket.getUploadedFile(id);
      readStream.pipe(res);
    } else {
      return { message: 'No Image' };
    }
  }
}
