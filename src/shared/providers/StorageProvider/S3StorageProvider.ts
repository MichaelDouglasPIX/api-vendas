import uploadConfig from '@config/upload';
import fs from 'fs';
import path from 'path';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import AppError from '@shared/errors/AppError';

export default class S3StorageProvider {
  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);
    const ContentType = originalPath.split('.').pop();

    if (!ContentType) {
      throw new Error('File not found');
    }

    const fileContent = await fs.promises.readFile(originalPath);

    try {
      const uploadParams = {
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
        ContentType,
        Body: fileContent,
      };

      const s3Client = new S3Client();
      await s3Client.send(new PutObjectCommand(uploadParams));
    } catch (err) {
      console.error(err);
      throw new AppError(`S3 ERROR`);
    }

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async DeleteFile(file: string): Promise<void> {
    try {
      const uploadParams = {
        Bucket: uploadConfig.config.aws.bucket,
        Key: file,
      };

      const s3Client = new S3Client();
      await s3Client.send(new DeleteObjectCommand(uploadParams));
    } catch (err) {
      console.error(err);
      throw new AppError(`S3 ERROR`);
    }
  }
}
