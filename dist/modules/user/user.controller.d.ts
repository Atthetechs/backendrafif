import { Response } from 'express';
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
    runContract(id: any, res: Response): Promise<any>;
    getImages(id: any, res: any): Promise<{
        message: string;
    }>;
}
