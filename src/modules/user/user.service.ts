import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreatePropertyDto } from './dto/create-property-ads.dto';
import { PropertyAds } from '../property-ads/entities/property-ads.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(PropertyAds)
    private propertyRepo: Repository<PropertyAds>,
  ) {}

  async findAll() {
    return await this.userRepo.find();
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

  async createAds(propertyDto: CreatePropertyDto, user: any) {
    try {
      const { propertytype, area, address, price, status } = propertyDto;
      const data = new PropertyAds();
      data.address = address;
      data.propertytype = propertytype;
      data.area = area;
      data.price = price;
      data.status = status;
      data.user = user;
      const save = await this.propertyRepo.save(data);
      if (save) {
        return {
          status: 200,
          message: 'Submit Successfully',
        };
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
