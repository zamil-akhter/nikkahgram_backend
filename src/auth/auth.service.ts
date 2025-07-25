import { User } from './../users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { LoginDto, VerifyOtpDto } from './dto/create-auth.dto';
import { messages } from 'src/helpers/message';
import { Otp } from './entities/otp.entity';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { generateOtp, SendEmailService } from 'src/helpers/utility';
import mongoose, { Model } from 'mongoose';
import { JwtService } from 'src/helpers/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    // @InjectModel(Subscription.name) private subscriptionModel: Model<Subscription>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailService: SendEmailService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(dto: LoginDto): Promise<{ success: boolean; message: string; data?: object }> {
    try {
      const user = await this.userModel.findOne({ $or: [{ email: dto.email }, { username: dto.email }] });
      if (user) {
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
          return { success: false, message: messages.INVALID_PASSWORD };
        }
        // const checkSubscription = await this.subscriptionModel.findOne({userId: user._id});
        // if(!checkSubscription){
        //   return { success: false, message: messages.SUBSCRIPTION_EXPIRED };
        // }
        const otp = await this.mailService.sendOtpToEmail(user.email);
        console.log('otp', otp);
        return { success: true, message: messages.LOGIN_SUCCESS, data: user };
      } else {
        if (!dto.email.includes('@')) {
          return { success: false, message: messages.USERNAME_DOES_NOT_EXISTS };
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const createUser = await this.userModel.create({
          email: dto.email,
          password: hashedPassword,
        });
        const otp = await this.mailService.sendOtpToEmail(createUser.email);
        console.log('otp', otp);
        return { success: true, message: messages.LOGIN_SUCCESS, data: createUser };
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: messages.LOGIN_FAILED };
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ success: boolean; message: string; data?: object }> {
    const { otp, email } = verifyOtpDto;
    const findUser = await this.userModel.findOne({ email });
    if (!findUser) {
      return { success: false, message: messages.USER_NOT_FOUND };
    }
    const checkOtp = await this.otpModel.findOne({ email, otp });
    if (!checkOtp) {
      return { success: false, message: messages.INVALID_OTP };
    }
    if (checkOtp.expiresAt < new Date()) {
      return { success: false, message: messages.OTP_EXPIRED };
    }

    await this.otpModel.deleteOne({ email });
    const token = this.jwtService.sign({ sub: findUser._id});
    return { success: true, message: messages.OTP_VERIFIED, data: { userData: findUser, token: token } };
  }
}
