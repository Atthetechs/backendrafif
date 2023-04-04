import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/database.typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { PropertyAdsModule } from './modules/property-ads/property-ads.module';
import { CustomerModule } from './modules/customer/customer.module';
import { ConfigModule } from '@nestjs/config';
import { PaymentDetailsModule } from './modules/payment_details/payment_details.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    PropertyAdsModule,
    CustomerModule,
    PaymentDetailsModule,
  ],
  controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
