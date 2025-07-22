import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ResponseHandler } from 'src/helpers/response-handler';

@Module({
  controllers: [AuthController],
  providers: [AuthService,ResponseHandler],
})
export class AuthModule {}
