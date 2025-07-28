import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InternalServerErrorSwagger, UnauthorizedSwagger } from 'src/helpers/utility';
import { SocialAuthDto } from './dto/create-auth.dto';

// @ApiTags at the controller level
export const AuthTag = () => {
  return applyDecorators(ApiTags('Auth'));
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

export const SocialLoginSwagger = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Authenticate user via social login (Google or Apple)' }),
    ApiBody({
      type: SocialAuthDto,
      description: 'Send social login token and type (google/apple)',
    }),
    // ✅ 200 OK
    ApiResponse({
      status: 200,
      description: 'User authenticated successfully',
      schema: {
        example: {
          success: true,
          message: 'User authenticated successfully',
          data: {
            userData: {
              _id: '64fca57c9d64cf2311a0abcd',
              firstName: 'John',
              lastName: 'Doe',
              email: 'johndoe@gmail.com',
              loginType: 'google',
              isEmailVerified: true,
              step: 1,
              // ... other user fields
            },
            token: 'JWT_TOKEN_HERE'
          }
        }
      }
    }),
    // ❌ 400 Bad Request
    ApiBadRequestResponse({
      description: 'Bad request due to invalid input or token issues',
      content: {
        'application/json': {
          examples: {
            InvalidLoginType: {
              summary: 'Invalid login type',
              value: {
                success: false,
                message: 'Invalid login type'
              }
            },
            InvalidGoogleToken: {
              summary: 'Invalid Google token',
              value: {
                success: false,
                message: 'Invalid Google token'
              }
            },
            ExpiredGoogleToken: {
              summary: 'Expired Google token',
              value: {
                success: false,
                message: 'Google token has expired'
              }
            },
            TokenUsedTooLate: {
              summary: 'Google token used too late',
              value: {
                success: false,
                message: 'Token used too late'
              }
            },
            InvalidAppleToken: {
              summary: 'Invalid Apple token',
              value: {
                success: false,
                message: 'Invalid Apple token'
              }
            },
            EmailNotProvided: {
              summary: 'Email not provided by Apple',
              value: {
                success: false,
                message: 'Email not provided by Apple'
              }
            }
          }
        }
      }
    }),
    InternalServerErrorSwagger(),
  );
};
