import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
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
  @Patch('update')
  async update(@Body() body: UpdateUserDto, @Req() req) {
    if (req.user.isAdmin) {
      const main = {};
      for (let key in body) {
        if (body[key] && body[key] != 'string' && body[key] != '') {
          Object.assign(main, { [key]: body[key] });
        }
      }
      return this.userService.update(main);
    } else {
      return { status: 400, message: 'Only Admin Can Hit This Api' };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('getUser')
  async getUser(@Req() req) {
    return await this.userService.finduser(req.user);
  }

  @Get('contractFile/:id')
  @ApiParam({
    name: 'id',
    required: true,
  })
  runContract(@Param('id') id: any) {
    return this.userService.contract(id);
  }

  @Get('images/:foldername/:id')
  getImages(
    @Param('foldername') foldername: any,
    @Param('id') id: any,
    @Res() res,
  ) {
    return this.userService.getOne(foldername, id, res);
  }
}
