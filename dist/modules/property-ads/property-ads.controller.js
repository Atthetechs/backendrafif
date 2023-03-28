"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyAdsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const create_property_ads_dto_1 = require("./dto/create-property-ads.dto");
const property_ads_service_1 = require("./property-ads.service");
let PropertyAdsController = class PropertyAdsController {
    constructor(propertyService) {
        this.propertyService = propertyService;
    }
    async property(files, propertyDto, req) {
        const allImages = JSON.parse(JSON.stringify(files));
        const { images } = allImages;
        return await this.propertyService.createProperty(propertyDto, images, req.user);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('create-property'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([{ name: 'images' }])),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array,
        create_property_ads_dto_1.CreatePropertyDto, Object]),
    __metadata("design:returntype", Promise)
], PropertyAdsController.prototype, "property", null);
PropertyAdsController = __decorate([
    (0, swagger_1.ApiTags)('Property'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('property'),
    __metadata("design:paramtypes", [property_ads_service_1.PropertyAdsService])
], PropertyAdsController);
exports.PropertyAdsController = PropertyAdsController;
//# sourceMappingURL=property-ads.controller.js.map