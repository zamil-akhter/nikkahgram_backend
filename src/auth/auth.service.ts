import { User } from './../users/entities/user.entity';
import { CommonService } from './../helpers/common.service';
import { Injectable } from '@nestjs/common';
import { LoginDto, SendOtpDto, SignUpDto, VerifyOtpDto } from './dto/create-auth.dto';
import { messages } from 'src/helpers/message';
import { Otp } from './entities/otp.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SendEmailService } from 'src/helpers/utility';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly commonService: CommonService,
    private readonly mailService: SendEmailService,
  ) {}

  async sendOtp(dto: SendOtpDto): Promise<{ success: boolean; message: string; data?: SendOtpDto }> {
    try {
      const { email, phoneNumber, countryCode } = dto;

      // const otp = this.commonService.generateOtp();
      const otp = '1234';
      const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes expiry

      const isUserExists = await this.userModel.findOne({ phoneNumber });
      if (isUserExists) {
        return { success: false, message: messages.PHONE_NUMBER_EXISTS };
      }

      const storedOtp = await this.otpModel.findOneAndUpdate({ phoneNumber }, { phoneNumber, otp, expiresAt }, { new: true, upsert: true });
      if (!storedOtp) {
        return { success: false, message: messages.FAILED_TO_STORE_OTP };
      }

      return { success: true, message: messages.OTP_SENT_SUCCESSFULLY };
    } catch (error) {
      console.log(`Error in sendOtp: ${error}`);
      return { success: false, message: messages.FAILED_TO_STORE_OTP };
    }
  }

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
    // const findUser = await this.userModel.findOne({ phoneNumber: phoneNumber });
    // if (!findUser) {
    //   return { success: false, message: messages.PHONE_NUMBER_NOT_FOUND };
    // }
    const checkOtp = await this.otpModel.findOne({ email, otp });
    if (!checkOtp) {
      return { success: false, message: messages.INVALID_OTP };
    }
    if (checkOtp.expiresAt < new Date()) {
      return { success: false, message: messages.OTP_EXPIRED };
    }
    await this.otpModel.deleteOne({ email });
    const findUser = await this.userModel.findOne({ email });
    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    return { success: true, message: messages.OTP_VERIFIED, data: { userData: findUser, token: token } };
  }
}
