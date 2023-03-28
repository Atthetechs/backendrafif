import { Repository } from 'typeorm';
import { S3ImageUpload } from '../s3Bucket/s3.service';
import { PropertyAds } from './entities/property-ads.entity';
export declare class PropertyAdsService {
    private propertyRepo;
    private readonly bucket;
    constructor(propertyRepo: Repository<PropertyAds>, bucket: S3ImageUpload);
    createProperty(dataa: any, images: any, user: any): Promise<{
        message: string;
        property_Id: number;
    }>;
}
