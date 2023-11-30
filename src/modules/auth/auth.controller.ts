import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { SignInDto } from './dtos/sign-in-dto';
import { Public } from 'src/utils/decorators/no-intercept.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    const signInData = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    return { data: signInData, metadata: signInDto };
  }
}
