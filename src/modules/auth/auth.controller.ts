import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInDto } from './dto/auth.signin.dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { SignUpDto } from './dto/auth.signup.dto'
import { Public } from '../../common/decorator/public.auth'

@ApiTags('认证服务')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  
  @Get('profile')
  @ApiOperation({ summary: '111', description: '111' })
  getProfile(@Request() req) {
    return req.user
  }

  @Public()
  @HttpCode(200)
  @Post('signin')
  @ApiOperation({ summary: '登陆', description: '登陆请求' })
  async signin(@Body() dto: SignInDto) {
    return this.authService.signin(dto)
  }

  @Public()
  @HttpCode(201)
  @Post('signup')
  @ApiOperation({ summary: '注册', description: '注册请求' })
  async signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto)
  }
}
