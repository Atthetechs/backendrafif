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
    block_No: string;
    plot_No: string;
    building_No: string;
    street_No: string;
    town: string;
    price: number;
    status: string;
    images: string[];
    customers: Customers;
    user: User;
}
