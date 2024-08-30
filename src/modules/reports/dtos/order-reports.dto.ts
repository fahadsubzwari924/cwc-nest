import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  REPORT_TYPES,
  ReportType,
} from '../order-reports/enums/report-types.enum';

export class ReportRequestDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(Object.values(REPORT_TYPES))
  reportType: ReportType;

  @IsOptional()
  dateRange?: { startDate: Date; endDate: Date };

  @IsOptional()
  year?: number;
}
