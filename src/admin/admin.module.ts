import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { ResponseHandler } from 'src/helpers/response-handler';
import { Forms, FormsSchema } from './entities/forms.entity';
import { FormKeys, FormKeysSchema } from './entities/keys.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Forms.name, schema: FormsSchema },
      { name: FormKeys.name, schema: FormKeysSchema}
    ]),
    UsersModule
  ],
  controllers: [AdminController],
  providers: [AdminService, ResponseHandler],
})
export class AdminModule { }
