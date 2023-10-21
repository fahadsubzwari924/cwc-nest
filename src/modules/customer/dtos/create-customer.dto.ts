import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 60)
  public fullName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(13)
  public contactNumber: string;

  @IsNotEmpty()
  @IsString()
  public city: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  public address: string;

  @IsOptional()
  @IsNumber()
  public age: number;

  @IsOptional()
  @IsString()
  public country: string;
}
