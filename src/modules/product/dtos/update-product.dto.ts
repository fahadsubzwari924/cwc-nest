import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  public name: string;

  @ApiProperty()
  @IsOptional()
  @MaxLength(300)
  public description: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  public cost: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  public price: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public weight: string;
}
