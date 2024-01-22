/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';
export class OrderByCityDTO {
  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;
}

