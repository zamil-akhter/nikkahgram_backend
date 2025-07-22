import { Injectable } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

@Injectable()
export class CommonService {
  constructor() {}

  public generateOtp() {
    let digits = '123456789';
    let otp = '';
    let len = digits.length;
    for (let i = 0; i < 4; i++) {
      otp += digits[Math.floor(Math.random() * len)];
    }
    return otp;
  }
}

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
