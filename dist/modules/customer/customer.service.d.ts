import { Repository } from 'typeorm';
import { PropertyAds } from '../property-ads/entities/property-ads.entity';
import { S3ImageUpload } from '../s3Bucket/s3.service';
import { Customers } from './entities/customer.entity';
export declare class CustomerService {
    private customerRepo;
    private propertyAd;
    private readonly bucket;
    constructor(customerRepo: Repository<Customers>, propertyAd: Repository<PropertyAds>, bucket: S3ImageUpload);
    create(data: any, file: any): Promise<{
        status: number;
        message: string;
    } | {
        message: string;
        status?: undefined;
    }>;
}
