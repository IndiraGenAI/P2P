import { SkipAuth } from '@core/guards/role.guard';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { baseController } from 'src/core/baseController';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import type { AuthenticatedUser } from './jwt.strategy';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.authService.register(dto);
    return baseController.getResult(
      res,
      201,
      result,
      'Registration successful',
    );
  }

  @SkipAuth()
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.authService.login(dto);
    return baseController.getResult(res, 200, result, 'Login successful');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(
    @Req() req: Request & { user: AuthenticatedUser },
    @Res() res: Response,
  ): Promise<Response> {
    const result = await this.authService.getProfile(req.user.id);
    return baseController.getResult(
      res,
      200,
      result,
      'Profile fetched successfully',
    );
  }
}
