import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3ImageUpload } from '../s3Bucket/s3.service';
import { Customers } from './entities/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customers) private customerRepo: Repository<Customers>,
    @Inject('BUCKET') private readonly bucket: S3ImageUpload,
  ) {}

  async create(data: any, file: any) {
    try {
      const { firstname, lastname, gender, phoneNumber, email } = data;
      let response: any = file ? await this.bucket.upload(file) : null;
      let res = this.customerRepo.create({
        firstname,
        lastname,
        gender,
        phoneNumber,
        email,
        imageid: response,
      });
      let respo = await this.customerRepo.save(res);
      if (!respo) {
        return { status: 400, message: 'Customer Not Created!' };
      } else {
        return { status: 200, message: 'Customer Created Successfully' };
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
