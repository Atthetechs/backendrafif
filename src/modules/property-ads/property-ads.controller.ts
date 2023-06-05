import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateCustomer,
  CreatePropertyDto,
  UpdateProperty,
} from './dto/create-property-ads.dto';
import { PropertyAdsService } from './property-ads.service';

@ApiTags('Property')
@ApiBearerAuth()
@Controller('property')
export class PropertyAdsController {
  constructor(private readonly propertyService: PropertyAdsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-property')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images' }]))
  @UsePipes(new ValidationPipe({ transform: true }))
  async property(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() propertyDto: CreatePropertyDto,
    @Req() req,
  ) {
    // const dataa = JSON.parse(JSON.stringify(propertyDto));
    const allImages = JSON.parse(JSON.stringify(files));
    const { images } = allImages;
    return await this.propertyService.createProperty(
      propertyDto,
      images,
      req.user,
    );
  }

  @Get('inputField')
  async find() {
    return this.propertyService.find();
  }

  @Patch('/addMoreProperty')
  update(@Body() body: UpdateProperty) {
    return this.propertyService.update(body);
  }

  @Post('createcustomer/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images' }, { name: 'profile_img' }]),
  )
  @UsePipes(new ValidationPipe({ transform: true }))
  async createCustomer(
    @Param('id') id: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() customerDto: CreateCustomer,
  ) {
    const alldata = JSON.parse(JSON.stringify(files));
    const data = JSON.parse(JSON.stringify(customerDto));
    const { images, profile_img } = alldata;
    return this.propertyService.createCustomer(+id, data, images, profile_img);
  }
}
