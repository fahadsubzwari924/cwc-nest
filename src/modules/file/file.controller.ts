import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './services/file.service';
import { Public } from 'src/utils/decorators/no-intercept.decorator';
import { UploadApiOptions } from 'cloudinary';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FilesService) {}

  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    /* only pdf and images are allowed to upload */
    const fileUploadOptions: UploadApiOptions = {
      allowed_formats: ['pdf', 'png', 'jpg', 'tiff'],
    };
    const fileUploadResponse = await this.fileService.uploadFile(
      file,
      fileUploadOptions,
    );
    return { data: fileUploadResponse, metadata: file.filename };
  }
}
