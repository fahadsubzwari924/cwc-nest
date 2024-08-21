import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(5, 60)
  public fullName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(13)
  public contactNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  public address: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  public age: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public country: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public province: string;
}
