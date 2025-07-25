import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';



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
