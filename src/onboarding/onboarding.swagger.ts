import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { messages } from 'src/helpers/message';
import { InternalServerErrorSwagger, UnauthorizedSwagger } from 'src/helpers/utility';
import { VerifyPhoneOtpDto } from './dto/onboarding.dto';

// @ApiTags at the controller level
export const OnboardingTag = () => {
  return applyDecorators(ApiTags('Onboarding'));
};

// Swagger decorator for sendPhoneOtp()
export const SendPhoneOtpSwagger = () => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Send Otp to phone number' }),
    ApiResponse({
      status: 200,
      description: messages.OTP_SENT_SUCCESSFULLY,
      schema: {
        example: {
          statusCode: 200,
          message: messages.OTP_SENT_SUCCESSFULLY,
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
                message: messages.PHONE_NUMBER_EXISTS,
              },
            },
            InvalidPhoneNumber: {
              value: {
                statusCode: 400,
                message: messages.INVALID_PHONE_NUMBER,
              },
            },
          },
        },
      },
    }),
    InternalServerErrorSwagger(),
  );
};

// Swagger decorator for verifyPhoneOtp()
export const VerifyPhoneOtpSwagger =() =>{
  return applyDecorators(
    ApiBearerAuth(),
    ApiTags("Onboarding"),
    ApiOperation({ summary: "Verify phone OTP and update user details" }),
    ApiBody({
      type: VerifyPhoneOtpDto,
    }),

    ApiResponse({
      status: 200,
      schema: {
        example: {
          success: true,
          message: messages.OTP_VERIFIED,
          data: {
            userData: {
              _id: "64fca57c9d64cf2311a01234",
              firstName: "John",
              lastName: "Doe",
              phoneNumber: "8974567890",
              countryCode: "+91",
              email: "john.doe@example.com",
              isPhoneNumberVerified: true,
              candidateId: "A1B2C3D4E",
              userName: "john_doe",
              contactByWhatsapp: true,
              contactByBackupEmail: false,
              contactBySocialMedia: true,
              dateOfBirth: "2010-11-25",
              gender: "male",
              backupEmail: "john.alt@example.com"
            }
          }
        }
      },
    }),

    ApiBadRequestResponse({
      content: {
        "application/json": {
          examples: {
            EmailMismatch: {
              summary: messages.EMAIL_MUST_MATCH,
              value: {
                success: false,
                message: messages.EMAIL_MUST_MATCH
              }
            },
            InvalidOtp: {
              summary: messages.INVALID_OTP,
              value: {
                success: false,
                message: messages.INVALID_OTP
              }
            },
            ExpiredOtp: {
              summary: messages.OTP_EXPIRED,
              value: {
                success: false,
                message: messages.OTP_EXPIRED
              }
            },
          }
        }
      }
    }),
    UnauthorizedSwagger(),
    InternalServerErrorSwagger(),
  );
}

