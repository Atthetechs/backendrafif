import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { createReadStream } from 'fs';

@Injectable()
export class S3ImageUpload {
  constructor() {}

  private s3 = new S3({
    region: process.env.AWS_BUCKET_REGIN,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  });

  async upload(data: any) {
    try {
      const fileStream = createReadStream(data.path);

      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: fileStream,
        Key: data.filename,
      };

      let respo = await this.s3.upload(uploadParams).promise();
      if (respo.Key) {
        return respo.Key;
      } else {
        throw new HttpException('Image Not Save', HttpStatus.BAD_REQUEST);
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
