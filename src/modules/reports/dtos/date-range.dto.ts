import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class DateRangeDTO {
  @ApiProperty()
  @IsNotEmpty()
  public startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  public endDate: Date;
}
