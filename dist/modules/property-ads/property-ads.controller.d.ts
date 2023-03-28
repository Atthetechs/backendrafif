/// <reference types="multer" />
import { CreatePropertyDto } from './dto/create-property-ads.dto';
import { PropertyAdsService } from './property-ads.service';
export declare class PropertyAdsController {
    private readonly propertyService;
    constructor(propertyService: PropertyAdsService);
    property(files: Array<Express.Multer.File>, propertyDto: CreatePropertyDto, req: any): Promise<{
        message: string;
        property_Id: number;
    }>;
}
