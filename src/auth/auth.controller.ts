import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SendOtpDto, SignUpDto, VerifyOtpDto } from './dto/create-auth.dto';
import { ResponseHandler } from 'src/helpers/response-handler';
import { Response } from 'express';
import { LoginSwagger, SendOtpSwagger } from './auth.swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseHandler: ResponseHandler,
  ) {}
  @Post('send-otp')
  @SendOtpSwagger()
  async sendOtp(@Body() dto: SendOtpDto, @Res() res: Response) {
    try {
      const result = await this.authService.sendOtp(dto);
      if (result.success) {
        return this.responseHandler.successResponse(res, result.message);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      console.log(error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }


  @Post('signin')
  // @UseGuards(AuthGuard)
  @LoginSwagger()
  async signIn(@Res() res: Response, @Body() dto: LoginDto) {
    try {
      const result = await this.authService.signIn(dto);
      if (result.success) {
        return this.responseHandler.successResponseWithData(
          res,
          result.message,
          result.data,
        );
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.catchErrorResponse(res);
    }
  }
  

  @Post('verify-otp')
  // @VerifyOtpSwagger()
  async verifyOtp(@Res() res: Response, @Body() verifyOtpDto: VerifyOtpDto){
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
}
