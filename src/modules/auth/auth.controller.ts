import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SignupDto } from './dtos/signup.dto';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token';
import { LoginPayloadDto } from './dtos/LoginPayloadDto';
import { CheckEmailDto } from './dtos/check-email.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private usersService: AuthService) {}

  @Post('signup')
  @ApiOkResponse({
    type: () => LoginPayloadDto,
    description: 'Refresh user access token',
  })
  async signup(@Body() user: SignupDto): Promise<LoginPayloadDto> {
    return this.usersService.signup(user);
  }

  @UseGuards(AuthGuard('local'))
  @ApiBody({ type: LoginDto })
  @Post('login')
  @ApiOkResponse({
    type: () => LoginPayloadDto,
    description: 'Refresh user access token',
  })
  async login(@Request() req): Promise<LoginPayloadDto> {
    return this.usersService.login(req.user);
  }

  @Post('token')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: () => LoginPayloadDto,
    description: 'Refresh user access token',
  })
  async token(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<LoginPayloadDto> {
    return this.usersService.refreshToken(refreshTokenDto);
  }

  @Post('checkEmail')
  @ApiOkResponse({
    type: () => Boolean,
    description: 'Check if email is already in use',
  })
  async checkEmail(@Body() dto: CheckEmailDto): Promise<{ exists: boolean }> {
    return await this.usersService.checkEmail(dto.email);
  }
}
