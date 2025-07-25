import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Forms, FormsSchema } from './entities/forms.entity';
import { ResponseHandler } from 'src/helpers/response-handler';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Forms.name, schema: FormsSchema }])
  ],
  controllers: [AdminController],
  providers: [AdminService, ResponseHandler],
})
export class AdminModule { }
