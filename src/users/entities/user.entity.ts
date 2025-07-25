import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { LoginTypeEnum, UserRole } from 'src/helpers/enums';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ default: '' })
  firstName: string;

  @Prop({ default: '' })
  lastName: string;

  @Prop({ default: '' })
  email: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: '' })
  backupEmail: string;

  @Prop({ default: false })
  isBackupEmailVerified: boolean;

  @Prop({ default: '' })
  countryCode: string;

  @Prop({ default: '' })
  phoneNumber: string;

  @Prop({ default: false })
  isPhoneNumberVerified: boolean;

  @Prop({ default: '' })
  userName: string;

  @Prop({ enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ default: '' })
  candidateId: string; // UUID

  @Prop({ default: '' })
  password: string;

  @Prop({ default: null })
  dateOfBirth: Date;

  @Prop({ default: '' })
  socialId: string;

  @Prop({ enum: LoginTypeEnum, default: LoginTypeEnum.EMAIL })
  loginType: string;

  @Prop({ default: '' })
  gender: string;

  @Prop({ default: false })
  contactByWhatsapp: boolean;

  @Prop({ default: false })
  contactByBackupEmail: boolean;

  @Prop({ default: false })
  contactBySocialMedia: boolean;

  @Prop({ default: '' })
  maritalStatus: string;

  @Prop({ type: [String], default: [] })
  maritalCategory: string[];

  @Prop({ default: '' })
  childrenStatus: string;

  @Prop({ type: [String], default: [] })
  exemption: string[];

  @Prop({ default: '' })
  referenceCode: string;

  // Ethnicity
  @Prop({ default: '' })
  ethnicOrigin: string;

  @Prop({ default: '' })
  ethnicOriginMixed: string;

  @Prop({ default: false })
  isMixedRace: boolean;

  @Prop({ default: '' })
  ethnicGroupDetails: string;

  // Location Residence
  @Prop({ default: '' })
  citizenship: string;

  @Prop({ default: '' })
  currentCountry: string;

  @Prop({ default: '' })
  currentCity: string;

  @Prop({ default: '' })
  settledSince: string;

  @Prop({ default: '' })
  raisedIn: string;

  // Appearance
  @Prop({ default: '' })
  height: string;

  @Prop({ default: '' })
  weight: string;

  @Prop({ type: [String], default: [] })
  physique: string[];

  @Prop({ type: [String], default: [] })
  complexion: string[];

  @Prop({ default: '' })
  ethnicAppearance: string;

  @Prop({ default: '' })
  facialAppearance: string;

  @Prop({ type: [String], default: [] })
  appearanceKeywords: string[];

  @Prop({ default: '' })
  appearanceDescription: string;

  @Prop({ type: [String], default: [] })
  bestFeatures: string[];

  @Prop({ type: [String], default: [] })
  clothingDetails: string[];

  // Occupation & Finances
  @Prop({ type: [String], default: [] })
  occupationAndFinances: string[];

  // Work & Education
  @Prop({ default: '' })
  qualification: string;

  @Prop({ default: '' })
  fieldOfWork: string;

  @Prop({ type: [String], default: [] })
  languages: string[];

  // Islamic Sect
  @Prop({ type: [String], default: [] })
  islamicSect: string[];

  @Prop({ default: '' })
  islamicSectOther: string;

  // Islamic Background
  @Prop({ default: '' })
  islamicMindset: string;

  @Prop({ default: '' })
  practicingHistory: string;

  @Prop({ default: false })
  isRevert: boolean;

  @Prop({ default: null })
  revertedSince: number;

  @Prop({ type: [String], default: [] })
  islamicPractices: string[];

  @Prop({ default: '' })
  scholarsListenedTo: string;

  @Prop({ default: '' })
  personalIssues: string;

  @Prop({ type: [String], default: [] })
  personalityTraits: string[];

  @Prop({ type: [String], default: [] })
  hobbyInterest: string[];

  @Prop({ default: '' })
  moreAboutMe: string;

  @Prop({ type: [String], default: [] })
  lifeMarriagePlan: string[];

  @Prop({ type: [String], default: [] })
  marriagePreference: string[];

  @Prop({ default: '' })
  preferredSpouse: string;

  @Prop({ default: '' })
  cannotAccept: string;

  @Prop({ default: false })
  isCoachingEnabled: boolean;

  @Prop({ default: null })
  submissionDate: Date;

  @Prop({ default: false })
  agreedToTermAndCondition: boolean;

  @Prop({ default: false })
  isInvisible: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  subscriptionStatus: boolean;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({ default: false })
  isRestricted: boolean;

  @Prop({ default: 1 })
  step: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('strict', false);    //this allows saving additional fields dynamically