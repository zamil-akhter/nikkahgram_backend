import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { FormDto, GetAllAccountsDto, GetFormDataDto } from './dto/admin.dto';
import { ResponseHandler } from 'src/helpers/response-handler';
import { messages } from 'src/helpers/message';
import { Response } from 'express';
import { UserRole } from 'src/helpers/enums';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('admin')
@UseGuards(RolesGuard)
@Roles(UserRole.SUPERADMIN, UserRole.SUB_ADMIN, UserRole.EMPLOYEE)
export class AdminController {
  constructor(private readonly adminService: AdminService,
    private readonly responseHandler: ResponseHandler
  ) { }

  @Post("add-edit-form-data")
  @ApiBearerAuth()
  async addEditFormData(@Res() res: Response, @Body() formDto: FormDto) {
    try {
      const result = await this.adminService.addEditFormData(formDto);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.errorResponseWithData(res, error.message, messages.INTERNAL_SERVER_ERROR);
    }
  }


  @Get("get-form-data")
  @ApiBearerAuth()
  async getFormData(@Res() res: Response, @Query() data: GetFormDataDto){
    try {
      const result = await this.adminService.getFormData(data);
      if (result.success) {
        return this.responseHandler.successResponseWithData(res, result.message, result.data);
      }
      return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.errorResponseWithData(res, error.message, messages.INTERNAL_SERVER_ERROR);
    }
  }


  @Get("get-all-accounts")
  @ApiBearerAuth()
  async getAllAccounts(@Res() res: Response, @Query() data: GetAllAccountsDto){
    try {
      const result = await this.adminService.getAllAccounts(data);
      // if (result.success) {
      //   return this.responseHandler.successResponseWithData(res, result.message, result.data);
      // }
      // return this.responseHandler.errorResponse(res, result.message);
    } catch (error) {
      return this.responseHandler.errorResponseWithData(res, error.message, messages.INTERNAL_SERVER_ERROR);
    }
  }
}
