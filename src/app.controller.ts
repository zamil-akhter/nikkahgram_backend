import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { HelloSwagger } from './app.swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @HelloSwagger()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
