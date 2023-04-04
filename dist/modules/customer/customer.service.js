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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const property_ads_entity_1 = require("../property-ads/entities/property-ads.entity");
const s3_service_1 = require("../s3Bucket/s3.service");
const customer_entity_1 = require("./entities/customer.entity");
const payment_entity_1 = require("../payment_details/entities/payment.entity");
let CustomerService = class CustomerService {
    constructor(customerRepo, propertyAd, payment, bucket) {
        this.customerRepo = customerRepo;
        this.propertyAd = propertyAd;
        this.payment = payment;
        this.bucket = bucket;
    }
    async create(data, file, profile_img) {
        try {
            const { property_Id } = data, result = __rest(data, ["property_Id"]);
            const propertyAd = await this.propertyAd.findOne({
                where: { id: property_Id },
            });
            if (propertyAd) {
                const response = file.length && (await this.bucket.upload(file));
                const profilepic = profile_img.length &&
                    (await this.bucket.singleImageUpload(profile_img[0]));
                const res = new customer_entity_1.Customers();
                Object.keys(result).forEach((key) => {
                    res[`${key}`] =
                        key == 'price' || key == 'advance_Payment'
                            ? parseInt(result[`${key}`])
                            : result[`${key}`];
                    res.profile_img = profilepic;
                    res.images = response;
                    res.propertyAds = propertyAd;
                });
                const respo = await this.customerRepo.save(res);
                const paymentRespo = new payment_entity_1.Payment();
                paymentRespo.payment_type = result.payment_type;
                paymentRespo.rent = parseInt(result.price);
                paymentRespo.paid = true;
                paymentRespo.customer = respo;
                const pay = await this.payment.save(paymentRespo);
                if (!respo && !pay) {
                    return { status: 400, message: 'Customer Not Created!' };
                }
                else {
                    return { status: 200, message: 'Customer Created Successfully' };
                }
            }
            else {
                return { message: 'This Property Not Available' };
            }
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customers)),
    __param(1, (0, typeorm_1.InjectRepository)(property_ads_entity_1.PropertyAds)),
    __param(2, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(3, (0, common_1.Inject)('BUCKET')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        s3_service_1.S3ImageUpload])
], CustomerService);
exports.CustomerService = CustomerService;
//# sourceMappingURL=customer.service.js.map