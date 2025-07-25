import { Injectable } from '@nestjs/common';
import { FormDto, GetAllAccountsDto, GetFormDataDto } from './dto/admin.dto';
import { messages } from 'src/helpers/message';
import { InjectModel } from '@nestjs/mongoose';
import { Forms } from './entities/forms.entity';
import { Model } from 'mongoose';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Forms.name) private formModel: Model<Forms>
  ) { }

  async addEditFormData(data: FormDto): Promise<{ success: boolean, message: string, data?: object }> {
    if (!Array.isArray(data.formData) || data.formData.length == 0) {
      return { success: false, message: messages.INPUT_MUST_BE_AN_ARRAY }
    }
    await Promise.all(
      data.formData.map(async (form) => {
        const checkFormKey = await this.formModel.findOne({ formType: form.formType, step: form.step, keyName: form.keyName })
        if (checkFormKey) {
          const payload = {
            formType: form.formType,
            step: Number(form.step),
            keyName: form.keyName,
            isVisible: form.isVisible,
            isRequired: form.isRequired,
            type: form.type,
            position: Number(form.position),
            optionsValues: form.optionsValue
          }
          await this.formModel.updateOne({ _id: checkFormKey._id }, payload)
        }
        else {
          const payload = {
            formType: form.formType,
            step: form.step,
            keyName: form.keyName,
            isVisible: form.isVisible,
            isRequired: form.isRequired,
            type: form.type,
            position: form.position,
            optionsValues: form.optionsValue
          }
          await this.formModel.create(payload)
        }
      }
      )

    )
    return { success: true, message: messages.SUCCESS_RESPONSE }
  }


  async getFormData(data: GetFormDataDto): Promise<{ success: boolean, message: string, data?: object }> {
    const { formType, step } = data;
    const result = await this.formModel.find({ formType: formType, step: step })
    if(result.length == 0){
      return { success: false, message: messages.NO_DATA_FOUND }
    }
    return { success: true, message: messages.SUCCESS_RESPONSE, data: result }
  }


  async getAllAccounts(data: GetAllAccountsDto){
  // Promise<{any}>
    // const {page, limit, search, filter}
  }
}