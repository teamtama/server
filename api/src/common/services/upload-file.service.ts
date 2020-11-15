import { HttpException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FileUpload } from 'graphql-upload';

@Injectable()
export abstract class UploadFileService<T> {
  private readonly tableName: string;

  protected constructor(private readonly repository: Repository<T>) {
    this.tableName = repository.metadata.tableName;
  }

  async uploadImage(targetId: string, file: FileUpload) {
    try {
      return 'imageUrl';
    } catch (e) {
      console.error(e);
      throw new HttpException(e.message, e.status);
    }
  }
}
