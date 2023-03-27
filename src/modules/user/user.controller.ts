import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/local-auth.guard';
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
  @Get('getUser')
  async getUser(@Req() req) {
    return await this.userService.finduser(req.user);
  }

  @Get('contractFile/:id')
  runContract(@Param('id') id: any, @Res() res: Response) {
    return this.userService.contract(id, res);
  }

  @Get('images/:id')
  getImages(@Param('id') id: any, @Res() res) {
    return this.userService.getOne(id, res);
  }
}
