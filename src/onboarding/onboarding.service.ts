import { Injectable } from '@nestjs/common';
import { messages } from 'src/helpers/message';
import { SendPhoneOtp, UpdateUserDto, VerifyPhoneOtpDto } from './dto/onboarding.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Otp } from 'src/auth/entities/otp.entity';
import { User } from 'src/users/entities/user.entity';
import { Model } from 'mongoose';
import { generateRandomCandidateId } from 'src/helpers/utility';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<Otp>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async sendPhoneOtp(dto: SendPhoneOtp, user: User): Promise<{ success: boolean; message: string; data?: SendPhoneOtp }> {
    try {
      const { phoneNumber, countryCode } = dto;

      // const otp = generateOtp();
      const otp = '1234';
      const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes expiry

      const isUserExists = await this.userModel.findOne({ phoneNumber, isPhoneNumberVerified: true });
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

  async verifyPhoneOtp(dto: VerifyPhoneOtpDto, user: User): Promise<{ success: boolean; message: string; data?: object }> {
    const { email, phoneNumber } = dto;
    const { password, otp, ...sanitizedDto } = dto as any;
    console.log('senitizedDto ------->>>>> ', sanitizedDto);
    console.log('password ------->>>>> ', password);

    if (email) {
      if (email !== user.email) {
        return { success: false, message: messages.EMAIL_MUST_MATCH };
      }
    }

    const checkOtp = await this.otpModel.findOne({ phoneNumber, otp });
    if (!checkOtp) {
      return { success: false, message: messages.INVALID_OTP };
    }
    if (checkOtp.expiresAt < new Date()) {
      return { success: false, message: messages.OTP_EXPIRED };
    }

    const findUser = await this.userModel.findOne({ email });
    if (!findUser) {
      return { success: false, message: messages.USER_NOT_FOUND };
    }

    let candidateId: string = '';
    let exists = true;

    while (exists) {
      candidateId = generateRandomCandidateId(9); // 9-character ID
      const existingUser = await this.userModel.findOne({ candidateId }).lean();
      if (existingUser) {
        exists = true;
      } else {
        exists = false;
      }
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      findUser._id,
      { ...sanitizedDto, isPhoneNumberVerified: true, candidateId },
      { new: true },
    );
    await this.otpModel.deleteOne({ phoneNumber });
    return { success: true, message: messages.OTP_VERIFIED, data: { userData: updatedUser } };
  }

  async updateUser(dto: UpdateUserDto, user: User): Promise<{ success: boolean; message: string; data?: object }> {
    const { maritalStatus, maritalCategory } = dto;

    const updatedUser = await this.userModel.findByIdAndUpdate(user._id, dto, { new: true });
    return { success: true, message: messages.OTP_VERIFIED, data: { userData: updatedUser } };
  }
}
