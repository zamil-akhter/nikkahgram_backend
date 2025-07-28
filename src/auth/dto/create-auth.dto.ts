import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { SocialLoginTypeEnum } from 'src/helpers/enums';



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


export class SocialAuthDto{
  @ApiProperty({ example: "Token" })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({ example: "google", enum: SocialLoginTypeEnum })
  @IsNotEmpty()
  @IsEnum(SocialLoginTypeEnum, { message: "Invalid login type" })
  type: SocialLoginTypeEnum;

  @ApiProperty({ example: "John", description: "First Name" })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty({ example: "Doe", description: "Last Name" })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty({ example: "johndoe@gmail.com", description: "Email" })
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string;
}