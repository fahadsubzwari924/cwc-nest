import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './services/cloudinary.provider';
import { FilesService } from './services/file.service';
import { FileController } from './file.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ConfigService, CloudinaryProvider, FilesService],
  controllers: [FileController],
  exports: [CloudinaryProvider, FilesService],
})
export class FileModule {}
