import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

export class OrderProductDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  cost: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsString()
  customizeName: string;

  @IsString()
  color: string;
}

export class OrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsString()
  customizeName: string;

  @IsString()
  color: string;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 400)
  public description: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  public amount: number;

  @IsNotEmpty()
  @IsString()
  public paymentMethod: string;

  @IsNotEmpty()
  @IsNumber()
  public customerId: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];

  @IsOptional()
  @IsString()
  public totalWeight: string;

  @IsOptional()
  @IsNumber()
  public totalProductQuantity: number;

  @IsNotEmpty()
  @IsString()
  public orderDate: Date;

  @IsNotEmpty()
  @IsNumber()
  public orderSourceId: number;
}
