import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { JwtService } from './helpers/jwt.service';

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
     AdminModule,

  ],
  controllers: [AppController],
  providers: [AppService, JwtService, {
    provide: APP_GUARD,
    useClass: AuthGuard
  }],
})
export class AppModule {}
