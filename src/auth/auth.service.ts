import { User } from './../users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { AdminLoginDto, ForgotPasswordDto, LoginDto, ResetPasswordDto, SocialAuthDto, VerifyOtpDto } from './dto/create-auth.dto';
import { messages } from 'src/helpers/message';
import { Otp } from './entities/otp.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { InjectModel } from '@nestjs/mongoose';
import { SendEmailService } from 'src/helpers/utility';
import mongoose, { Model } from 'mongoose';
import { JwtService } from 'src/helpers/jwt.service';
import { SocialLoginTypeEnum, UserRole } from 'src/helpers/enums';
import { OAuth2Client, LoginTicket } from 'google-auth-library';
import axios from 'axios';
import jwkToPem from 'jwk-to-pem';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    // @InjectModel(Subscription.name) private subscriptionModel: Model<Subscription>,
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly mailService: SendEmailService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(dto: LoginDto): Promise<{ success: boolean; message: string; data?: object }> {
    const user = await this.userModel.findOne({ $or: [{ email: dto.email }, { username: dto.email }] });
    if (user) {
      if (user.role != UserRole.USER) {
        return { success: false, message: messages.INVALID_ROLE };
      }
      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) {
        return { success: false, message: messages.INVALID_PASSWORD };
      }
      // const checkSubscription = await this.subscriptionModel.findOne({userId: user._id});
      // if(!checkSubscription){
      //   return { success: false, message: messages.SUBSCRIPTION_EXPIRED };
      // }
      const otp = '1234';
      const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes expiry

      const storedOtp = await this.otpModel.findOneAndUpdate(
        { email: dto.email },
        { email: dto.email, otp: otp, expiresAt: expiresAt },
        { new: true, upsert: true },
      );
      if (!storedOtp) {
        return { success: false, message: messages.FAILED_TO_STORE_OTP };
      }
      try {
        await this.mailService.sendOtpToEmail(dto.email, otp);
      } catch (error) {
        return { success: false, message: messages.FAILED_TO_SEND_OTP };
      }
      return { success: true, message: messages.OTP_SENT_SUCCESSFULLY, data: user };
    } else {
      if (!dto.email.includes('@')) {
        return { success: false, message: messages.USERNAME_DOES_NOT_EXISTS };
      }
      const hashedPassword = await bcrypt.hash(dto.password, 10);
      const createUser = await this.userModel.create({
        email: dto.email,
        password: hashedPassword,
      });
      const otp = '1234';
      const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes expiry

      const storedOtp = await this.otpModel.findOneAndUpdate(
        { email: dto.email },
        { email: dto.email, otp: otp, expiresAt: expiresAt },
        { new: true, upsert: true },
      );
      if (!storedOtp) {
        return { success: false, message: messages.FAILED_TO_STORE_OTP };
      }
      try {
        await this.mailService.sendOtpToEmail(createUser.email, otp);
      } catch (error) {
        return { success: false, message: messages.FAILED_TO_SEND_OTP };
      }
      return { success: true, message: messages.OTP_SENT_SUCCESSFULLY, data: createUser };
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ success: boolean; message: string; data?: object }> {
    const { otp, email } = verifyOtpDto;
    const findUser = await this.userModel.findOne({ email });
    if (!findUser) {
      return { success: false, message: messages.USER_NOT_FOUND };
    }
    if (findUser.role != UserRole.USER) {
      return { success: false, message: messages.INVALID_ROLE };
    }
    const checkOtp = await this.otpModel.findOne({ email, otp });
    if (!checkOtp) {
      return { success: false, message: messages.INVALID_OTP };
    }
    if (checkOtp.expiresAt < new Date()) {
      return { success: false, message: messages.OTP_EXPIRED };
    }
    // await this.otpModel.deleteOne({ email });
    await this.userModel.findOneAndUpdate({ email }, { isEmailVerified: true });
    const token = await this.jwtService.sign({ sub: findUser._id });
    console.log('t oken-------', token);
    return { success: true, message: messages.OTP_VERIFIED, data: { userData: findUser, token: token } };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ success: boolean; message: string; data?: object }> {
    const { email } = forgotPasswordDto;
    const findUser = await this.userModel.findOne({ email });
    if (!findUser) {
      return { success: false, message: messages.USER_NOT_FOUND };
    }
    const otp = '1234';
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes expiry

    const storedOtp = await this.otpModel.findOneAndUpdate(
      { email: email },
      { email: email, otp: otp, expiresAt: expiresAt },
      { new: true, upsert: true },
    );
    if (!storedOtp) {
      return { success: false, message: messages.FAILED_TO_STORE_OTP };
    }
    try {
      await this.mailService.sendOtpToEmail(email, otp);
    } catch (error) {
      return { success: false, message: messages.FAILED_TO_SEND_OTP };
    }
    return { success: true, message: messages.OTP_SENT_SUCCESSFULLY };
  }

  async verifyForgotPasswordOtp(verifyOtpDto: VerifyOtpDto): Promise<{ success: boolean; message: string; data?: object }> {
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
    return { success: true, message: messages.OTP_VERIFIED, data: { userId: findUser._id } };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ success: boolean; message: string; data?: object }> {
    const { userId, password } = resetPasswordDto;
    const findUser = await this.userModel.findOne({ _id: userId });
    if (!findUser) {
      return { success: false, message: messages.USER_NOT_FOUND };
    }
    const checkPassword = await bcrypt.compare(password, findUser.password);
    if (checkPassword) {
      return { success: false, message: messages.PASSWORD_ALREADY_EXISTS };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const resetPassword = await this.userModel.updateOne({ _id: userId }, { password: hashedPassword });
    if (!resetPassword) {
      return { success: false, message: messages.FAILED_TO_RESET_PASSWORD };
    }
    return { success: true, message: messages.PASSWORD_RESET_SUCCESSFULLY };
  }

  async adminLogin(adminLoginDto: AdminLoginDto): Promise<{ success: boolean, message: string, data?: object }> {
    const { email, password } = adminLoginDto
    const findUser = await this.userModel.findOne({ $or: [{ email: email }, { userName: email }] }, { email: 1, firstName: 1, lastName: 1, role: 1, userName: 1, password: 1 })
    if (!findUser) {
      return { success: false, message: messages.USER_NOT_FOUND };
    }
    if (![UserRole.SUPERADMIN, UserRole.SUB_ADMIN, UserRole.EMPLOYEE].includes(findUser.role)) {
      return { success: false, message: messages.INVALID_ROLE };
    }
    const checkPassword = await bcrypt.compare(password, findUser.password);
    if (!checkPassword) {
      return { success: false, message: messages.INVALID_PASSWORD };
    }
    const token = await this.jwtService.sign({ sub: findUser._id });
    return { success: true, message: messages.LOGIN_SUCCESS, data: { userData: findUser, token: token } };
  }

  // Fetch Apple's public key dynamically
  async getApplePublicKey(kid: string): Promise<string> {
    const url = 'https://appleid.apple.com/auth/keys'; // Apple's public keys URL
    const response = await axios.get(url);
    const keys = response.data.keys;

    const key = keys.find((k: any) => k.kid === kid);
    if (!key) throw new Error('Apple public key not found');

    const pem = jwkToPem(key);
    return pem;
  }

  async socialAuth(socialAuthDto: SocialAuthDto): Promise<{ success: boolean; message: string; data?: object }> {
    try {
      let { email, token, type, firstName, lastName } = socialAuthDto;

      let name: string | undefined;
      let socialId: string | undefined;

      // ---------- GOOGLE AUTH ----------
      if (type === SocialLoginTypeEnum.GOOGLE) {
        try {
          const ticket = await this.googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
          });

          const payload = ticket.getPayload();
          if (!payload || !payload.email || !payload.sub) {
            return { success: false, message: messages.INVALID_GOOGLE_TOKEN };
          }

          const currentTime = Math.floor(Date.now() / 1000);
          if (!payload.exp || currentTime > payload.exp) {
            return { success: false, message: messages.GOOGLE_TOKEN_EXPIRED };
          }

          email = payload.email;
          name = payload.name;
          socialId = payload.sub;
        } catch (error) {
          if (error.message?.includes('Token used too late')) {
            return { success: false, message: messages.TOKEN_USED_TOO_LATE };
          }
          return { success: false, message: messages.INVALID_GOOGLE_TOKEN };
        }
      }

      // ---------- APPLE AUTH ----------
      else if (type === SocialLoginTypeEnum.APPLE) {
        try {
          const decodedHeader: any = jwt.decode(token, { complete: true });
          if (!decodedHeader?.header?.kid) {
            return { success: false, message: messages.INVALID_APPLE_TOKEN };
          }

          const applePublicKey = await this.getApplePublicKey(decodedHeader.header.kid);
          const decodedToken: any = jwt.verify(token, applePublicKey, {
            algorithms: ['RS256'],
          });

          if (!decodedToken?.email || !decodedToken?.sub) {
            return { success: false, message: messages.EMAIL_NOT_PROVIDED_BY_PROVIDER };
          }

          email = decodedToken.email;
          socialId = decodedToken.sub;
        } catch (error) {
          console.error('Apple Token Verification Error:', error);
          return { success: false, message: messages.INVALID_APPLE_TOKEN };
        }
      }

      // ---------- INVALID TYPE ----------
      else {
        return { success: false, message: messages.INVALID_SOCIAL_AUTH_TYPE };
      }

      // ---------- FIND OR CREATE USER ----------
      let user = await this.userModel.findOne({ email });

      if (!user) {
        // If name not provided in DTO, extract from `name` field
        if (!firstName && name?.trim()) {
          const nameParts = name.split(' ');
          firstName = nameParts[0];
          lastName = nameParts.slice(1).join(' ');
        }

        user = new this.userModel({
          email,
          firstName,
          lastName,
          socialId,
          loginType: type,
          isEmailVerified: true,
          step: 1,
        });
        await user.save();
      } else {
        user.socialId = socialId!;
        user.loginType = type;
        await user.save();
      }

      // ---------- GENERATE JWT TOKEN ----------
      const jwtToken = await this.jwtService.sign({ sub: user._id });

      return {
        success: true,
        message: messages.USER_AUTHENTICATED_SUCCESSFULLY,
        data: { userData: user, token: jwtToken },
      };
    } catch (error) {
      console.error('Error during socialAuth:', error);
      return { success: false, message: messages.SOMETHING_WENT_WRONG };
    }
  }
}
