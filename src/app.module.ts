import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OnboardingModule } from './onboarding/onboarding.module';

@Module({
  imports: [
    // config module
    ConfigModule.forRoot({ isGlobal: true }),

     // MongoDB connection
     MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get('DATABASE_URI');
        return { uri };
      },
      inject: [ConfigService],
    }),

     UsersModule,
     AuthModule,
     OnboardingModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
