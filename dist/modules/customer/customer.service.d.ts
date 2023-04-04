import { Repository } from 'typeorm';
import { PropertyAds } from '../property-ads/entities/property-ads.entity';
import { S3ImageUpload } from '../s3Bucket/s3.service';
import { Customers } from './entities/customer.entity';
import { Payment } from '../payment_details/entities/payment.entity';
export declare class CustomerService {
    private customerRepo;
    private propertyAd;
    private payment;
    private readonly bucket;
    constructor(customerRepo: Repository<Customers>, propertyAd: Repository<PropertyAds>, payment: Repository<Payment>, bucket: S3ImageUpload);
    create(data: any, file: any, profile_img: any): Promise<{
        status: number;
        message: string;
    } | {
        message: string;
        status?: undefined;
    }>;
}
