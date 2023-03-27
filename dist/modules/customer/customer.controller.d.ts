/// <reference types="multer" />
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    createCustomer(files: Array<Express.Multer.File>, customerDto: CreateCustomerDto): Promise<{
        status: number;
        message: string;
    } | {
        message: string;
        status?: undefined;
    }>;
}
