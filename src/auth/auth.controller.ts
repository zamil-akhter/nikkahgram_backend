import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/create-auth.dto';
import { ResponseHandler } from 'src/helpers/response-handler';
import { Response } from 'express';
import { LoginSwagger } from './auth.swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly responseHandler: ResponseHandler,
  ) {}

  @Post('login')
  // @UseGuards(AuthGuard)
  @LoginSwagger()
  async logIn(@Res() res: Response, @Body() dto: LogInDto) {
    try {
      const result = await this.authService.login(dto);
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

  @Post('signup')
  // @UseGuards(AuthGuard)
  async signUp(@Res() res: Response, @Body() dto: LogInDto) {
    try {
      const result = await this.authService.login(dto);
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
}
