import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { Media, MediaSchema } from './entities/media.entity';
import { UserRestrictions, UserRestrictionsSchema } from './entities/user-restrictions.entity';
import { Reference, ReferenceSchema } from './entities/reference.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Media.name, schema: MediaSchema },
      { name: UserRestrictions.name, schema: UserRestrictionsSchema },
      { name: Reference.name, schema: ReferenceSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
