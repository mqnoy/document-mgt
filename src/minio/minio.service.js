import { Dependencies, Injectable, ConsoleLogger } from '@nestjs/common';
import * as Minio from 'minio';
import config from '../common/configs/config';

@Dependencies(ConsoleLogger)
@Injectable()
export class MinioService {
  constructor(logger) {
    this.logger = logger;
    this.logger.setContext(MinioService.name);
  }

  async onModuleInit() {
    this.client = new Minio.Client({
      endPoint: config.minio.server,
      port: config.minio.port,
      useSSL: config.minio.ssl,
      accessKey: config.minio.accessKey,
      secretKey: config.minio.secretKey,
    });

    if (this.client) {
      this.logger.debug(
        `connected to minio server ${config.minio.server}:${config.minio.port}`,
      );
    }
  }

  /**
   *
   * @returns {Minio.Client}
   */
  client() {
    return this.client;
  }

  /**
   *
   * @param {String} objectName
   * @param {String} filePath
   */
  async uploadFile(objectName, filePath) {
    try {
      await this.client.fPutObject(config.minio.bucket, objectName, filePath);
      this.logger.debug(`File uploaded successfully`);
    } catch (error) {
      this.logger.error(`Error uploading file `, error);
      throw error;
    }
  }

  /**
   *
   * @param {String} objectName
   * @returns {Promise<String>}
   */
  async presignUpload(objectName) {
    const expiry = 24 * 60 * 60; // 1 day
    try {
      const presignedUrl = await this.client.presignedPutObject(
        config.minio.bucket,
        objectName,
        expiry,
      );

      this.logger.debug(`presignedUrl: ${presignedUrl} `);

      return presignedUrl;
    } catch (error) {
      this.logger.error(`Error uploading file `, error);
      throw error;
    }
  }
}
