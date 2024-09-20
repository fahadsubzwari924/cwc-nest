import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { REPORT_CATEGORIES, ReportCategory } from '../enums';
import { Type } from 'class-transformer';
import { DateRangeDTO } from './date-range.dto';

export class ReportTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(REPORT_CATEGORIES))
  category: ReportCategory;
}

export class ReportFilters {
  @IsOptional()
  dateRange?: DateRangeDTO;

  @IsOptional()
  year?: number;
}

export class ReportRequestDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ReportTypeDto)
  reportTypes: Array<ReportTypeDto>;

  @IsNotEmpty()
  @Type(() => ReportFilters)
  filters: ReportFilters;
}
