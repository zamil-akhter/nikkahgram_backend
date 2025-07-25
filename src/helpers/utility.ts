import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiResponse } from '@nestjs/swagger';
import * as ejs from 'ejs';
import * as path from 'path';


@Injectable()
export class SendEmailService {
  constructor(private readonly configService: ConfigService) {
    const apiKey = process.env.SEND_GRID_KEY;
    // sgMail.setApiKey(apiKey);
  }

  async sendOtpToEmail(
    email: string,
    otp: string
  ): Promise<any> {
    // const pageUrl = `https://devapp.nrs-crm.com/auth/officer_sup/newpassword?token=${token}`
    // const emailContent = await ejs.renderFile(
    //   path.join(__dirname, '..', '..', '..', 'views', 'email2.ejs'),
    //   {
    //     otp: otp
    //   },
    // );
    // const msg = {
    //   to: `${email}`,
    //   from: { email: `${process.env.SEND_GRID_EMAIL}`, name: 'NRS-APPLIANCE-REPAIR-CRM' },
    //   subject: 'Tim CRM Testing Sfs',
    //   html: emailContent,
    // };

    try {
    //   const response = await sgMail.send(msg);
    console.log('Email sent successfully:', otp);
    return otp
    } catch (error) {
      console.error('Error sending email:', error.response ? error.response.body : error.message);
    }
  }
}


export async function generateOtp() {
  let digits = '123456789';
  let otp = '';
  let len = digits.length;
  for (let i = 0; i < 4; i++) {
    otp += digits[Math.floor(Math.random() * len)];
  }
  return otp;
}

export const generateRandomCandidateId = (length = 9): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  console.log('generated id ------->>>> ',result);
  return result;
};


// ! Reusable Swagger decorators

// Reusable Swagger decorator for 401 errors
export const UnauthorizedSwagger = () => {
  return ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: { example: { statusCode: 401, message: 'Unauthorized user' } },
  });
};

// Reusable Swagger response for 500 errors
export const InternalServerErrorSwagger = () => {
  return ApiResponse({
    status: 500,
    description: 'Something Went Wrong',
    schema: {
      example: { statusCode: 500, error: 'Something Went Wrong' },
    },
  });
};
