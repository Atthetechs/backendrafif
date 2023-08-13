import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { PaymentDetailsService } from './payment_details.service';
import { PaymentDTO, PaymentUpdate } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Payment')
@ApiBearerAuth()
@Controller('payment')
export class PaymentDetailsController {
  constructor(private readonly paymentService: PaymentDetailsService) {}

  // @Post('check/:id')
  // handleTimeout(@Param('id') id: any) {
  //   if (id || GlobalService.id) {
  //     return this.paymentService.checkDate(id);
  //   }
  // }

	@Get('check')
  paymentCheck() {
    return this.paymentService.PaymentCheck();
  }

  @Post('create')
  // @UsePipes(new ValidationPipe({ transform: true }))
  paymentDetail(@Body() body: PaymentDTO) {
    return this.paymentService.createPayment(
      body.property_id,
      body.price,
      body.payment_type,
      body.check_no,
      body.bank_name,
      body.link_name,
      body.link,
      body.being_of,
    );
  }

  // {
  //   propert_id: 21,
  //   price: 30000,
  //   payment_type: 'cash',
  //   bank_name: 'string',
  //   check_no: 'string',
  //   link_name: 'string',
  //   link: 'string'
  // }

  @Patch('update')
  paymentUpdate(@Body() body: PaymentUpdate) {
    // if (req.user.isAdmin) {
    return this.paymentService.update(body);
    // } else {
    // return { status: 400, message: 'Only Admin Can Hit This Api' };
    // }
  }
}
