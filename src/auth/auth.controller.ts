import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminLoginDto, ForgotPasswordDto, LoginDto, ResetPasswordDto, SocialAuthDto, VerifyOtpDto } from './dto/create-auth.dto';
import { ResponseHandler } from 'src/helpers/response-handler';
import { Response } from 'express';
import { LoginSwagger, SocialLoginSwagger } from './auth.swagger';
import { messages } from 'src/helpers/message';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from 'src/helpers/enums';
import { Public } from 'src/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseHandler: ResponseHandler,
  ) {}

  @Post('signin')
  @Public()
  @LoginSwagger()
  async signIn(@Res() res: Response, @Body() dto: LoginDto) {
    try {
      const result = await this.authService.signIn(dto);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  @Post('verify-otp')
  @Public()
  // @VerifyOtpSwagger()
  async verifyOtp(@Res() res: Response, @Body() verifyOtpDto: VerifyOtpDto) {
    try {
      const result = await this.authService.verifyOtp(verifyOtpDto);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  @Post('forgot-password')
  @Public()
  // @ForgotPasswordSwagger()
  async forgotPassword(@Res() res: Response, @Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      const result = await this.authService.forgotPassword(forgotPasswordDto);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.errorResponseWithData(res, error.message, messages.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('verify-forgot-password-otp')
  @Public()
  // @ForgotPasswordSwagger()
  async verifyForgotPasswordOtp(@Res() res: Response, @Body() verifyOtpDto: VerifyOtpDto) {
    try {
      const result = await this.authService.verifyForgotPasswordOtp(verifyOtpDto);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.errorResponseWithData(res, error.message, messages.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('reset-password')
  @Public()
  // @ForgotPasswordSwagger()
  async resetPassword(@Res() res: Response, @Body() resetPasswordDto: ResetPasswordDto) {
    try {
      const result = await this.authService.resetPassword(resetPasswordDto);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.errorResponseWithData(res, error.message, messages.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('admin-login')
  @Public()
  async adminLogin(@Res() res: Response, @Body() adminLoginDto: AdminLoginDto) {
    try {
      const result = await this.authService.adminLogin(adminLoginDto);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.errorResponseWithData(res, error.message, messages.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('social-auth')
  @SocialLoginSwagger()
  async socialAuth(@Body() socialAuthDto: SocialAuthDto, @Res() res: Response) {
    try {
      const result = await this.authService.socialAuth(socialAuthDto);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.errorResponseWithData(res, error.message, messages.INTERNAL_SERVER_ERROR);
    }
  }
}
