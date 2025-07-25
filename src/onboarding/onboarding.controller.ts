
import { Controller, Post, Body, Res } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { SendPhoneOtp, UpdateUserDto, VerifyPhoneOtpDto } from './dto/onboarding.dto';
import { Response } from 'express';
import { ResponseHandler } from 'src/helpers/response-handler';
import { SendPhoneOtpSwagger, VerifyPhoneOtpSwagger } from './onboarding.swagger';
import { GetFullUser } from 'src/decorators/get-full-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('onboarding')
export class OnboardingController {
  constructor(
    private readonly onboardingService: OnboardingService,
    private readonly responseHandler: ResponseHandler,
  ) {}

  @Post('send-phone-otp')
  @SendPhoneOtpSwagger()
  async sendPhoneOtp(@Body() dto: SendPhoneOtp, @Res() res: Response, @GetFullUser() user: User) {
    try {
      const result = await this.onboardingService.sendPhoneOtp(dto,user);
      if (result.success) {
        return this.responseHandler.successResponse(res, result.message);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      console.log(error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  @Post('verify-phone-otp')
  @VerifyPhoneOtpSwagger()
  async verifyPhoneOtp(@Res() res: Response, @Body() dto: VerifyPhoneOtpDto, @GetFullUser() user: User) {
    try {
      const result = await this.onboardingService.verifyPhoneOtp(dto, user);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      console.log('Error in verifyPhoneOtp', error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

  @Post('update-user')
  // @UpdateUserSwagger()
  async updateUser(@Res() res: Response,@Body() dto: UpdateUserDto, @GetFullUser() user: User) {
    try {
      const result = await this.onboardingService.updateUser(dto,user);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      console.log('Error in updateUser', error);
      return this.responseHandler.catchErrorResponse(res);
    }
  }

}
