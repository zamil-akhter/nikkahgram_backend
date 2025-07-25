import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class SendOtpDto {
  @ApiProperty( { example: 'test@example.com' })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+91' })
  @IsOptional()
  @IsString()
  countryCode: string;

  @ApiProperty({ example: '8974567890' })
  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid',
  }) // Ensures a valid phone format
  phoneNumber: string;
}

export class LoginDto {

  @ApiProperty()
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}


export class VerifyOtpDto{
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  otp: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
}

export class SignUpDto {
  @ApiProperty()
  @IsOptional()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  email: string;

  @IsOptional()
  @ApiProperty()
  backupEmail: string;

  @IsOptional()
  @ApiProperty()
  password: string;

  @IsOptional()
  @ApiProperty()
  countryCode: string;

  @IsOptional()
  @ApiProperty()
  phoneNumber: string;

  @IsOptional()
  @ApiProperty()
  dateOfBirth: Date;

  @IsOptional()
  @ApiProperty()
  userName: string;

  @ApiProperty()
  @IsOptional()
  gender: string;
}


export class ForgotPasswordDto{
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
}


export class ResetPasswordDto{

  @IsNotEmpty()
  @IsMongoId()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  password: string;


}


export class AdminLoginDto{

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  password: string;
}