import { Module } from '@nestjs/common';
import { PaymentDetailsController } from './payment_details.controller';
import { PaymentDetailsService } from './payment_details.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Customers } from '../customer/entities/customer.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { LatePayment } from './entities/late_payment.entity';
import { PropertyAds } from '../property-ads/entities/property-ads.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Customers, LatePayment, PropertyAds]),
    ScheduleModule.forRoot(),
  ],
  controllers: [PaymentDetailsController],
  providers: [PaymentDetailsService],
})
export class PaymentDetailsModule {}
