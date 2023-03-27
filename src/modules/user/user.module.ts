import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { PropertyAds } from '../property-ads/entities/property-ads.entity';
import { S3ImageUpload } from '../s3Bucket/s3.service';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PropertyAds]),
    MulterModule.register({
      dest: './public',
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    JwtService,
    {
      provide: 'BUCKET',
      useClass: S3ImageUpload,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
