import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';

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
  public productIds: Array<number>;

  @IsOptional()
  @IsString()
  public customizeName: string;

  @IsOptional()
  @IsString()
  public weight: string;

  @IsOptional()
  @IsNumber()
  public quantity: number;
}
