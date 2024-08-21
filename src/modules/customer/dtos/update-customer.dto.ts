import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ValidationCodes } from 'src/utils/constants/validation-codes.constant';

export class UpdateCustomerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidationCodes.customerDTO.customerNameIsRequired })
  @Length(5, 60, { message: ValidationCodes.customerDTO.customerNameLength })
  @IsOptional()
  public fullName: string;

  @ApiProperty()
  @IsNotEmpty({ message: ValidationCodes.customerDTO.contactNumberIsRequired })
  @IsString()
  @MaxLength(13, { message: ValidationCodes.customerDTO.contactMaxLength })
  @IsOptional()
  public contactNumber: string;

  @ApiProperty()
  @IsNotEmpty({ message: ValidationCodes.customerDTO.cityIsRequired })
  @IsString()
  @IsOptional()
  public city: string;

  @ApiProperty()
  @IsNotEmpty({ message: ValidationCodes.customerDTO.addressIsRequired })
  @IsString()
  @MaxLength(300, { message: ValidationCodes.customerDTO.addressMaxLength })
  @IsOptional()
  public address: string;

  @ApiProperty()
  @IsNumber({}, { message: ValidationCodes.customerDTO.ageShouldNumber })
  @IsOptional()
  public age: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  public country: string;
}
