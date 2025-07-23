import { Injectable } from '@nestjs/common';
import { LogInDto } from './dto/create-auth.dto';
import { messages } from 'src/helpers/message';

@Injectable()
export class AuthService {
  async login(
    dto: LogInDto,
  ): Promise<{ success: boolean; message: string; data?: LogInDto }> {
    try {
      return { success: true, message: messages.LOGIN_SUCCESS, data: dto };
    } catch (error) {
      console.log(error);
      return { success: false, message: messages.LOGIN_FAILED };
    }
  }
}
