import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class DateRangeDTO {
  @ApiProperty()
  @IsOptional()
  public startDate: Date;

  @ApiProperty()
  @IsOptional()
  public endDate: Date;
}
