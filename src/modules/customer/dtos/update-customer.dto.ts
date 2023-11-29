import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class UpdateCustomerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(5, 60)
  @IsOptional()
  public fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(13)
  @IsOptional()
  public contactNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  public city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  @IsOptional()
  public address: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  @IsOptional()
  public age: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsOptional()
  public country: string;
}
