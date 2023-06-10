import {
  Body,
  Controller,
  Param,
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
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CustomerService } from './customer.service';
import {
  CreateCustomerDto,
  CreateNonActiveDto,
  UpdateCustomer,
  uploadFile,
} from './dto/create-customer.dto';

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

  // customer id
  @UseGuards(JwtAuthGuard)
  @Post('upload-contractfile/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'contractFile' }]))
  uplodFile(
    @Param('id') id: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() data: uploadFile,
  ) {
    const alldata = JSON.parse(JSON.stringify(files));
    const { contractFile } = alldata;
    return this.customerService.upload(contractFile, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profile_img'))
  update(
    @UploadedFile() files: Express.Multer.File,
    @Body() body: UpdateCustomer,
  ) {
    const data = JSON.parse(JSON.stringify(body));
    return this.customerService.updates(data, files);
  }

  // @UseGuards(JwtAuthGuard)
  @Patch('non-active')
  NonActive(@Body() data: CreateNonActiveDto) {
    const { propertyid, active, grace_days, price, created_at } = data;
    return this.customerService.findAll(
      propertyid,
      active,
      grace_days,
      price,
      created_at,
    );
  }
}
