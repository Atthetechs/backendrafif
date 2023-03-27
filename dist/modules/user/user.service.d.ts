import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { PropertyAds } from '../property-ads/entities/property-ads.entity';
import { S3ImageUpload } from '../s3Bucket/s3.service';
export declare class UserService {
    private userRepo;
    private propertyRepo;
    private readonly bucket;
    constructor(userRepo: Repository<User>, propertyRepo: Repository<PropertyAds>, bucket: S3ImageUpload);
    findAll(): Promise<User[]>;
    finduser(user: any): Promise<User>;
    findOne(email: string): Promise<User | undefined>;
    create(createDto: CreateUserDto): Promise<User | {
        message: string;
    }>;
    contract(id: any, res: any): Promise<any>;
    getOne(id: any, res: any): Promise<{
        message: string;
    }>;
}
