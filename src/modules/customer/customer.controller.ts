import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('images', {
      storage: diskStorage({
        destination: './public',
      }),
    }),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  createCustomer(
    @UploadedFile() file: Express.Multer.File,
    @Body() customerDto: CreateCustomerDto,
  ) {
    const data = JSON.parse(JSON.stringify(customerDto));
    return this.customerService.create(data, file);
  }
}
