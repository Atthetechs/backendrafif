import { PropertyAds } from 'src/modules/property-ads/entities/property-ads.entity';
export declare class Customers {
    id: number;
    firstname: string;
    lastname: string;
    address: string;
    company_name: string;
    price: number;
    nationality_id: string;
    country: string;
    gender: string;
    phoneNumber: string;
    mobileNumber: string;
    email: string;
    grace_days: string;
    created_at: string;
    profile_img: string;
    images: string[];
    propertyAds: PropertyAds;
}
