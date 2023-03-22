import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { PropertyAds } from '../property-ads/entities/property-ads.entity';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, PropertyAds])],
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    JwtService,
  ],
  exports: [UserService],
})
export class UserModule {}
