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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const bcrypt = require("bcrypt");
const property_ads_entity_1 = require("../property-ads/entities/property-ads.entity");
const s3_service_1 = require("../s3Bucket/s3.service");
let UserService = class UserService {
    constructor(userRepo, propertyRepo, bucket) {
        this.userRepo = userRepo;
        this.propertyRepo = propertyRepo;
        this.bucket = bucket;
    }
    async findAll() {
        return await this.userRepo.find();
    }
    async finduser(user) {
        try {
            const res = await this.userRepo
                .createQueryBuilder('user')
                .where('user.email =:email', { email: user.email })
                .leftJoinAndSelect('user.propertyAds', 'propertyAds')
                .leftJoinAndSelect('propertyAds.customers', 'customers')
                .getOne();
            return res;
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findOne(email) {
        return this.userRepo.findOne({ where: { email: email.toLowerCase() } });
    }
    async create(createDto) {
        try {
            const { username, email, password, phoneNumber } = createDto;
            const hashPassword = await bcrypt.hash(password, 8);
            const userExist = await this.userRepo.findOne({ where: { email } });
            if (userExist) {
                return { message: 'User Already Exist' };
            }
            else {
                const data = this.userRepo.create({
                    username,
                    email,
                    password: hashPassword,
                    phoneNumber,
                });
                const datasave = await this.userRepo.save(data);
                if (!datasave) {
                    return { message: 'User Not Saved' };
                }
                else {
                    return datasave;
                }
            }
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async contract(id) {
        try {
            const response = await this.propertyRepo.findOneBy({ id });
            if (response) {
                const { customers } = response, result = __rest(response, ["customers"]);
                return result;
            }
            else {
                throw new common_1.HttpException('Property Not Exist', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getOne(id, res) {
        if (id) {
            const readStream = await this.bucket.getUploadedFile(id);
            readStream.pipe(res);
        }
        else {
            return { message: 'No Image' };
        }
    }
};
UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(property_ads_entity_1.PropertyAds)),
    __param(2, (0, common_1.Inject)('BUCKET')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        s3_service_1.S3ImageUpload])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map