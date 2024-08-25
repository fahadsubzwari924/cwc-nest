import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/entities';
import { SeedingController } from './seeding.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [SeedingController],
})
export class SeedingModule {}
