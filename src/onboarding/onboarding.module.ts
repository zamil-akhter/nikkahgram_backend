import { Module } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingController } from './onboarding.controller';
import { ResponseHandler } from 'src/helpers/response-handler';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    UsersModule, AuthModule
  ],
  controllers: [OnboardingController],
  providers: [OnboardingService,ResponseHandler],
})
export class OnboardingModule {}
