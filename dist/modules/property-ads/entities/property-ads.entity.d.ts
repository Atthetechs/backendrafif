import { Customers } from 'src/modules/customer/entities/customer.entity';
import { User } from 'src/modules/user/entities/user.entity';
export declare class PropertyAds {
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
    price: string;
    status: string;
    created_at: string;
    images: string[];
    customers: Customers;
    user: User;
}
