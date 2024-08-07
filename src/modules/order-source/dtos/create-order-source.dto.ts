import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { OrderSourceType } from 'src/modules/order/enums/order-source-type.enum';

export class CreateOrderSourceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(5, 150)
  public name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  public description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(OrderSourceType, { message: 'Invalud order source type' })
  public type: OrderSourceType;
}
