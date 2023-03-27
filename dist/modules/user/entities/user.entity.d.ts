import { PropertyAds } from 'src/modules/property-ads/entities/property-ads.entity';
export declare class User {
    id: number;
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
    propertyAds: PropertyAds[];
}
