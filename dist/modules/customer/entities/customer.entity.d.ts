import { PropertyAds } from 'src/modules/property-ads/entities/property-ads.entity';
export declare class Customers {
    id: number;
    firstname: string;
    lastname: string;
    nationality_id: string;
    country: string;
    gender: string;
    phoneNumber: string;
    email: string;
    profile_img: string;
    images: string[];
    propertyAds: PropertyAds;
}
