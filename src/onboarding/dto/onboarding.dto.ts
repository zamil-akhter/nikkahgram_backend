import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class SendPhoneOtp {
  @ApiProperty({ example: '+91' })
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @ApiProperty({ example: '8974567890' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Phone number must be a valid',
  }) // Ensures a valid phone format
  phoneNumber: string;
}

export class VerifyPhoneOtpDto {
  @ApiProperty({ example: '8974567890' })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({ example: '1234' })
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty({ example: '3' })
  @IsNotEmpty()
  @IsString()
  step: string;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsOptional()
  email: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsOptional()
  backupEmail: string;

  @ApiProperty()
  @IsOptional()
  password: string;

  @ApiProperty({ example: '+91' })
  @IsOptional()
  countryCode: string;

  @ApiProperty({ example: '2010-11-25' })
  @IsOptional()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, {
    message: 'Invalid date format, use YYYY-MM-DD',
  })
  dateOfBirth: string;

  @ApiProperty({ example: 'john_doe' })
  @IsOptional()
  userName: string;

  @ApiProperty({ example: 'male' })
  @IsOptional()
  gender: string;

  @ApiProperty({ example: true })
  @IsOptional()
  contactByWhatsapp: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  contactByBackupEmail: boolean;

  @ApiProperty({ example: true })
  @IsOptional()
  contactBySocialMedia: boolean;
}

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  maritalStatus: string;

  @ApiProperty()
  @IsOptional()
  maritalCategory: string;

  @ApiProperty()
  @IsOptional()
  childrenStatus: string;

  @ApiProperty()
  @IsOptional()
  referenceCode: string;

  @ApiProperty()
  @IsOptional()
  ethnicOrigin: string;

  @ApiProperty()
  @IsOptional()
  ethnicOriginMixed: string;

  @ApiProperty()
  @IsOptional()
  isMixedRace: boolean;

  @ApiProperty()
  @IsOptional()
  citizenship: string;

  @ApiProperty()
  @IsOptional()
  currentCountry: string;

  @ApiProperty()
  @IsOptional()
  currentCity: string;

  @ApiProperty()
  @IsOptional()
  settledSince: string;

  @ApiProperty()
  @IsOptional()
  raisedIn: string;

  @ApiProperty()
  @IsOptional()
  height: string;

  @ApiProperty()
  @IsOptional()
  weight: string;

}
