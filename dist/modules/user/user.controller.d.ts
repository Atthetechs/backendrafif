import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-dto';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    private readonly authService;
    constructor(userService: UserService, authService: AuthService);
    AllUser(): Promise<import("./entities/user.entity").User[]>;
    Signin(loginDto: LoginUserDto): Promise<{
        access_token: string;
        user: import("./entities/user.entity").User;
    }>;
    Signup(createDto: CreateUserDto): Promise<import("./entities/user.entity").User | {
        message: string;
    }>;
    getUser(req: any): Promise<import("./entities/user.entity").User>;
    runContract(id: any): Promise<{
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
        grace_days: string;
        status: string;
        created_at: string;
        images: string[];
        user: import("./entities/user.entity").User;
    }>;
    getImages(id: any, res: any): Promise<{
        message: string;
    }>;
}
