import {
  Body,
  Controller,
  Delete,
  Get,
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
import {
  CreateCustomer,
  CreatePropertyDto,
  OwnerData,
  UpdateOwnerData,
  UpdateProperty,
  UpdatePropertyDto,
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

  @UseGuards(JwtAuthGuard)
  @Patch('update-property')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images' }]))
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateProperty(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() propertyDto: UpdatePropertyDto,
    @Req() req,
  ) {
    if (req.user.isAdmin) {
      const allImages = JSON.parse(JSON.stringify(files));
      const { images } = allImages;
      const main = {};
      for (let key in propertyDto) {
        if (
          propertyDto[key] &&
          propertyDto[key] != 'string' &&
          propertyDto[key] != ''
        ) {
          Object.assign(main, { [key]: propertyDto[key] });
        }
      }
      return await this.propertyService.updateProperty(main, images);
    } else {
      return { status: 400, message: 'Only Admin Can Hit This Api' };
    }
  }

  @Get('inputField')
  async find() {
    return this.propertyService.find();
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/addMoreProperty')
  update(@Body() body: UpdateProperty, @Req() req) {
    if (req.user.isAdmin) {
      return this.propertyService.update(body);
    } else {
      return { status: 400, message: 'Only Admin Can Hit This Api' };
    }
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

  @Post('owner-data')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  async OwnerData(
    @Body() data: OwnerData,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const alldata = JSON.parse(JSON.stringify(data));
    return this.propertyService.createOwner(alldata, image);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update-owner-data')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  async UpdateOwnerData(
    @Body() data: UpdateOwnerData,
    @UploadedFile() image: Express.Multer.File,
    @Req() req,
  ) {
    // const alldata = JSON.parse(JSON.stringify(data));
    if (req.user.isAdmin) {
      const main = {};
      for (let key in data) {
        if (data[key] && data[key] != 'string' && data[key] != '') {
          Object.assign(main, { [key]: data[key] });
        }
      }
      return this.propertyService.updateOwner(main, image);
    } else {
      return { status: 400, message: 'Only Admin Can Hit This Api' };
    }
  }

  @Get('find_all_owners')
  findAll() {
    return this.propertyService.findOwner();
  }

  @Delete('owner/:id')
  Delete(@Param('id') id: number) {
    return this.propertyService.deleteOwner(id);
  }
}
