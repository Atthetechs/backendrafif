import { LatePayment } from 'src/modules/payment_details/entities/late_payment.entity';
import { Payment } from 'src/modules/payment_details/entities/payment.entity';
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
    advance_Payment: number;
    grace_days: string;
    created_at: Date;
    profile_img: string;
    images: string[];
    propertyAds: PropertyAds;
    payment_details: Payment;
    Late_payment: LatePayment;
}
