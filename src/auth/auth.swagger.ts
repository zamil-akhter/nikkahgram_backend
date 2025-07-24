import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InternalServerErrorSwagger, UnauthorizedSwagger } from 'src/helpers/common.service';

// @ApiTags at the controller level
export const AuthTag = () => {
  return applyDecorators(ApiTags('Auth'));
};

// Swagger decorator for SendOtpSwagger()
export const SendOtpSwagger = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Send Otp to phone number' }),
    ApiResponse({
      status: 200,
      description: 'Otp sent successfully',
      schema: {
        example: {
          statusCode: 200,
          message: 'Otp sent successfully',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Bad Request',
      content: {
        'application/json': {
          examples: {
            PhoneAlreadyExists: {
              value: {
                statusCode: 400,
                message: 'Phone number already exists',
              },
            },
            InvalidPhoneNumber: {
              value: {
                statusCode: 400,
                message: 'Phone number must be a valid',
              },
            },
          },
        },
      },
    }),
    UnauthorizedSwagger(),
    InternalServerErrorSwagger(),
  );
};

// Swagger decorator for signIn()
export const LoginSwagger = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Sign in user' }),
    ApiResponse({
      status: 200,
      description: 'User signed in successfully',
      schema: {
        example: {
          statusCode: 200,
          message: 'Login successful',
          data: {
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            isVerified: true,
            step: 1,
            isProfileSetup: false,
          },
          token: 'your_jwt_token',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Bad Request',
      content: {
        'application/json': {
          examples: {
            EmailNotFound: {
              value: { statusCode: 400, message: 'Email not found' },
            },
            IncorrectPassword: {
              value: { statusCode: 400, message: 'Incorrect password' },
            },
          },
        },
      },
    }),
    InternalServerErrorSwagger(),
  );
};
