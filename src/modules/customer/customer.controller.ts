import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
} from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@ApiTags('Customer')
@ApiBearerAuth()
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images' }]))
  @UsePipes(new ValidationPipe({ transform: true }))
  createCustomer(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() customerDto: CreateCustomerDto,
  ) {
    const alldata = JSON.parse(JSON.stringify(files));
    const data = JSON.parse(JSON.stringify(customerDto));
    const { images } = alldata;
    return this.customerService.create(data, images);
  }
}
