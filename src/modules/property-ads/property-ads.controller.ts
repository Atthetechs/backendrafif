import {
  Body,
  Controller,
  Get,
  Param,
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
import { CreatePropertyDto } from './dto/create-property-ads.dto';
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
}
