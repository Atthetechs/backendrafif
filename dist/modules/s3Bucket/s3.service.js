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
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3ImageUpload = void 0;
const common_1 = require("@nestjs/common");
const aws_sdk_1 = require("aws-sdk");
const fs_1 = require("fs");
let S3ImageUpload = class S3ImageUpload {
    constructor() {
        this.s3 = new aws_sdk_1.S3({
            region: process.env.AWS_BUCKET_REGIN,
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY,
        });
    }
    async upload(data) {
        try {
            const pictures = [];
            for (let i = 0; i < data.length; i++) {
                const fileStream = (0, fs_1.createReadStream)(data[i].path);
                const uploadParams = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Body: fileStream,
                    Key: data[i].filename,
                };
                const respo = await this.s3.upload(uploadParams).promise();
                if (respo.Key)
                    pictures.push({ name: data[i].originalname, key: respo.Key });
            }
            if (pictures.length == data.length) {
                return pictures;
            }
            else {
                return pictures;
            }
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async singleImageUpload(data) {
        try {
            const fileStream = (0, fs_1.createReadStream)(data.path);
            const uploadParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Body: fileStream,
                Key: data.filename,
            };
            const respo = await this.s3.upload(uploadParams).promise();
            if (respo.Key) {
                return respo.Key;
            }
            else {
                throw new common_1.HttpException('Profile Image Not Save', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    async getUploadedFile(id) {
        const downloadParams = {
            Key: id,
            Bucket: process.env.AWS_BUCKET_NAME,
        };
        return this.s3.getObject(downloadParams).createReadStream();
    }
};
S3ImageUpload = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], S3ImageUpload);
exports.S3ImageUpload = S3ImageUpload;
//# sourceMappingURL=s3.service.js.map