import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 150)
  public email: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 15)
  public password: string;
}
