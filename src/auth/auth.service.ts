import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/create-auth.dto';
import { messages } from 'src/helpers/message';

@Injectable()
export class AuthService {
  async login(
    dto: LoginDto,
  ): Promise<{ success: boolean; message: string; data?: LoginDto }> {
    try {
      return { success: true, message: messages.LOGIN_SUCCESS, data: dto };
    } catch (error) {
      console.log(error);
      return { success: false, message: messages.LOGIN_FAILED };
    }
  }
}
