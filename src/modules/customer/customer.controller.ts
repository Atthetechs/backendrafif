import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images' }, { name: 'profile_img' }]),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  createCustomer(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() customerDto: CreateCustomerDto,
  ) {
    const alldata = JSON.parse(JSON.stringify(files));
    const data = JSON.parse(JSON.stringify(customerDto));
    const { images, profile_img } = alldata;
    return this.customerService.create(data, images, profile_img);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  update(@Body() body: any, @Req() req) {
    return this.customerService.updates(req.user);
  }
}
