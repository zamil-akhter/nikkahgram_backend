import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMongoId, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';



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