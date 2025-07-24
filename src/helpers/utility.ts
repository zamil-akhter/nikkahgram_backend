import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as ejs from "ejs";
import * as path from "path";

@Injectable()
export class SendEmailService {
  constructor(private readonly configService: ConfigService) {
    const apiKey = process.env.SEND_GRID_KEY
    // sgMail.setApiKey(apiKey);
  }

  async sendOtpToEmail(
    email: string,
  ): Promise<any> {
    // const pageUrl = `https://devapp.nrs-crm.com/auth/officer_sup/newpassword?token=${token}`
    const otp = await generateOtp();
    const emailContent = await ejs.renderFile(
      path.join(__dirname, '..', '..', '..', 'views', 'email2.ejs'),
      {
        otp: otp
      },
    );
    const msg = {
      to: ${email},
      from: { email: ${process.env.SEND_GRID_EMAIL}, name: 'NRS-APPLIANCE-REPAIR-CRM' },
      subject: 'Tim CRM Testing Sfs',
      html: emailContent,
    };

    try {
    //   const response = await sgMail.send(msg);
    return otp
      console.log('Email sent successfully:', otp);
    } catch (error) {
      console.error(
        'Error sending email:',
        error.response ? error.response.body : error.message,
      );
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