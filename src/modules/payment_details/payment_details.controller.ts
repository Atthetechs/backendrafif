import { Body, Controller, Param, Post } from '@nestjs/common';
import { PaymentDetailsService } from './payment_details.service';
import { PaymentDTO } from './dto/payment.dto';

@Controller('payment')
export class PaymentDetailsController {
  constructor(private readonly paymentService: PaymentDetailsService) {}

  // @Post('check/:id')
  // handleTimeout(@Param('id') id: any) {
  //   if (id || GlobalService.id) {
  //     return this.paymentService.checkDate(id);
  //   }
  // }

  @Post('create')
  paymentDetail(@Body() body: PaymentDTO) {
    return this.paymentService.createPayment(body.customer_id, body.price);
  }
}
