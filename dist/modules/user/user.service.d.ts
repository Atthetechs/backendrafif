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
    contract(id: any): Promise<{
        id: number;
        owner_name: string;
        owner_father_name: string;
        phoneNumber: string;
        owner_address: string;
        owner_company: string;
        country: string;
        nationality_Id: string;
        propertytype: string;
        area: string;
        address: string;
        block_No: string;
        plot_No: string;
        building_No: string;
        street_No: string;
        town: string;
        price: number;
        status: string;
        images: string[];
        user: User;
    }>;
    getOne(id: any, res: any): Promise<{
        message: string;
    }>;
}
