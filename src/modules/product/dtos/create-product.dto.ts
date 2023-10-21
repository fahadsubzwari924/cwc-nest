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

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(5, 100)
  public name: string;

  @ApiProperty()
  @MaxLength(300)
  public description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  public cost: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public weight: string;
}
