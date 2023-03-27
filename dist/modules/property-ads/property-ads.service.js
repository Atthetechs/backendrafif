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
exports.PropertyAdsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const s3_service_1 = require("../s3Bucket/s3.service");
const property_ads_entity_1 = require("./entities/property-ads.entity");
let PropertyAdsService = class PropertyAdsService {
    constructor(propertyRepo, bucket) {
        this.propertyRepo = propertyRepo;
        this.bucket = bucket;
    }
    async createProperty(dataa, images, user) {
        try {
            const response = images.length
                ? await this.bucket.upload(images)
                : [];
            const data = new property_ads_entity_1.PropertyAds();
            Object.keys(dataa).forEach((key) => {
                data[`${key}`] = dataa[`${key}`];
                data.images = response;
                data.user = user;
            });
            const save = await this.propertyRepo.save(data);
            if (save) {
                return {
                    message: 'Created Successfully',
                    url: `${process.env.BACKEND_URL}/user/contractFile/${save.id}`,
                };
            }
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
PropertyAdsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(property_ads_entity_1.PropertyAds)),
    __param(1, (0, common_1.Inject)('BUCKET')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        s3_service_1.S3ImageUpload])
], PropertyAdsService);
exports.PropertyAdsService = PropertyAdsService;
//# sourceMappingURL=property-ads.service.js.map