import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { OrderStatus } from '../enums/order-setatus.enum';
import { OrderProductDto } from './create-order.dto';

export class UpdateOrderDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 400)
  @IsOptional()
  public description: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  public amount: number;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  public paymentMethod: string;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  public customerId: number;

  @IsNotEmpty()
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products: OrderProductDto[];

  @IsOptional()
  @IsString()
  public totalWeight: string;

  @IsOptional()
  @IsNumber()
  public totalProductQuantity: number;

  @IsOptional()
  @IsEnum(OrderStatus, { message: 'Invalud order status type' })
  public status: OrderStatus;

  @IsNotEmpty()
  @IsString()
  public orderDate: Date;

}
