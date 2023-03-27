"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyAdsModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const platform_express_1 = require("@nestjs/platform-express");
const typeorm_1 = require("@nestjs/typeorm");
const s3_service_1 = require("../s3Bucket/s3.service");
const property_ads_entity_1 = require("./entities/property-ads.entity");
const property_ads_controller_1 = require("./property-ads.controller");
const property_ads_service_1 = require("./property-ads.service");
let PropertyAdsModule = class PropertyAdsModule {
};
PropertyAdsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([property_ads_entity_1.PropertyAds]),
            platform_express_1.MulterModule.register({
                dest: './public',
            }),
        ],
        controllers: [property_ads_controller_1.PropertyAdsController],
        providers: [
            property_ads_service_1.PropertyAdsService,
            jwt_1.JwtService,
            {
                provide: 'BUCKET',
                useClass: s3_service_1.S3ImageUpload,
            },
        ],
    })
], PropertyAdsModule);
exports.PropertyAdsModule = PropertyAdsModule;
//# sourceMappingURL=property-ads.module.js.map