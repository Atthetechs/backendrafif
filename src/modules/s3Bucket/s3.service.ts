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
      const pictures: any = [];

      for (let i = 0; i < data.length; i++) {
        const fileStream = createReadStream(data[i].path);
        const uploadParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Body: fileStream,
          Key: `customerImages/${data[i].filename}`,
        };
        const respo = await this.s3.upload(uploadParams).promise();
        if (respo.Key)
          pictures.push({ name: data[i].originalname, key: respo.Key });
      }

      if (pictures.length == data.length) {
        return pictures;
      } else {
        throw new HttpException('Images Not Save', HttpStatus.BAD_REQUEST);
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async singleImageUpload(data: any) {
    try {
      const fileStream = createReadStream(data.path);

      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: fileStream,
        Key: `customerProfile/${data.filename}`,
      };

      const respo = await this.s3.upload(uploadParams).promise();
      if (respo.Key) {
        return respo.Key;
      } else {
        throw new HttpException(
          'Profile Image Not Save',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async contractFiles(data: any) {
    try {
      const pictures: any = [];

      for (let i = 0; i < data.length; i++) {
        const fileStream = createReadStream(data[i].path);
        const uploadParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Body: fileStream,
          Key: `contractFiles/${data[i].filename}`,
        };
        const respo = await this.s3.upload(uploadParams).promise();
        if (respo.Key)
          pictures.push({ name: data[i].originalname, key: respo.Key });
      }

      if (pictures.length == data.length) {
        return pictures;
      } else {
        throw new HttpException('Images Not Save', HttpStatus.BAD_REQUEST);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async getUploadedFile(foldername: any, id: any) {
    const downloadParams = {
      Key: `${foldername}/${id}`,
      Bucket: process.env.AWS_BUCKET_NAME,
    };
    return this.s3.getObject(downloadParams).createReadStream();
  }
}
