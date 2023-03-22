import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Req,
  Response,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { CreatePropertyDto } from './dto/create-property-ads.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('getall')
  AllUser() {
    return this.userService.findAll();
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async Signin(@Body() loginDto: LoginUserDto) {
    return await this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('signup')
  @UsePipes(new ValidationPipe({ transform: true }))
  async Signup(@Body() createDto: CreateUserDto) {
    return await this.userService.create(createDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('submit-ads')
  ads(@Body() propertyDto: CreatePropertyDto, @Req() req) {
    return this.userService.createAds(propertyDto, req.user);
  }
}
