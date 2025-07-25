import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from './entities/otp.entity';
import { ResponseHandler } from 'src/helpers/response-handler';
import { UsersModule } from 'src/users/users.module';
import { SendEmailService } from 'src/helpers/utility';
import { JwtService } from 'src/helpers/jwt.service';

@Module({
  imports:[
    UsersModule,
    MongooseModule.forFeature([
      { name: Otp.name, schema: OtpSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService,ResponseHandler, SendEmailService, JwtService],
  exports: [MongooseModule],
})
export class AuthModule {}
