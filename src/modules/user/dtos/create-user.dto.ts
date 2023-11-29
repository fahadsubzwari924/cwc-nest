import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(3, 150)
  public fullName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(3, 150)
  public email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(5, 15)
  public password: string;

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
  public age: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public country: string;
}
