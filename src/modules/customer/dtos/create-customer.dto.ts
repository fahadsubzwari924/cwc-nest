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

export class CreateCustomerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidationCodes.customerDTO.customerNameIsRequired })
  @Length(5, 60, { message: ValidationCodes.customerDTO.customerNameLength })
  public fullName: string;

  @ApiProperty()
  @IsNotEmpty({ message: ValidationCodes.customerDTO.contactNumberIsRequired })
  @IsString()
  @MaxLength(13, { message: ValidationCodes.customerDTO.contactMaxLength })
  public contactNumber: string;

  @ApiProperty()
  @IsNotEmpty({ message: ValidationCodes.customerDTO.cityIsRequired })
  @IsString()
  public city: string;

  @ApiProperty()
  @IsNotEmpty({ message: ValidationCodes.customerDTO.addressIsRequired })
  @IsString()
  @MaxLength(300, { message: ValidationCodes.customerDTO.addressMaxLength })
  public address: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber({}, { message: ValidationCodes.customerDTO.ageShouldNumber })
  public age: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  public country: string;
}
