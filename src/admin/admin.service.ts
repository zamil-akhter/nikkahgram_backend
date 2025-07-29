import { Injectable } from '@nestjs/common';
import { FormDto, GetAccountDetailsDto, GetAllAccountsDto, GetFormDataDto } from './dto/admin.dto';
import { messages } from 'src/helpers/message';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Forms } from './entities/forms.entity';
import { FormKeys } from './entities/keys.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Forms.name) private formModel: Model<Forms>,
    @InjectModel(FormKeys.name) private formKeysModel: Model<FormKeys>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }

  async addEditFormData(data: FormDto): Promise<{ success: boolean, message: string, data?: object }> {
    // if (!Array.isArray(data.formData) || data.formData.length == 0) {
    //   return { success: false, message: messages.INPUT_MUST_BE_AN_ARRAY }
    // }

    let addUpdateForm: any;
    const checkFormExists = await this.formModel.findOne({ formType: data.formType, step: data.step });
    if (!checkFormExists) {
      addUpdateForm = await this.formModel.create({ formType: data.formType, step: data.step, title: data.title, subtitle: data.subtitle })
    }
    else {
      addUpdateForm = await this.formModel.findOneAndUpdate({ formType: data.formType, step: data.step }, { formData: data.formType, step: Number(data.step), title: data.title, subtitle: data.subtitle }, { new: true })
    }

    if (!addUpdateForm) {
      return { success: false, message: messages.FAILED_TO_UPDATE_FORM }
    }
    if (data.formData?.length > 0) {
      await Promise.all(
        data.formData.map(async (form) => {
          const checkFormKey = await this.formKeysModel.findOne({ formId: addUpdateForm._id, keyName: form.keyName })
          if (checkFormKey) {
            const payload = {
              formId: addUpdateForm._id,
              keyName: form.keyName,
              label: form.label,
              isVisible: form.isVisible,
              isRequired: form.isRequired,
              type: form.type,
              position: Number(form.position),
              optionsValues: form.optionsValue,
              rules: form.rules
            }
            await this.formKeysModel.updateOne({ _id: checkFormKey._id }, payload)
          }
          else {
            const payload = {
              formId: addUpdateForm._id,
              keyName: form.keyName,
              label: form.label,
              isVisible: form.isVisible,
              isRequired: form.isRequired,
              type: form.type,
              position: Number(form.position),
              optionsValues: form.optionsValue,
              rules: form.rules
            }
            await this.formKeysModel.create(payload)
          }
        }
        )

      )
    }
    return { success: true, message: messages.SUCCESS_RESPONSE }
  }

  async getAllForms(): Promise<{ success: boolean, message: string, data?: Forms[] }> {
    const getAllForms = await this.formModel.aggregate([{
      $group: {
        _id: "$formType",
        formType: { $first: "$formType" },
        lastUpdatedAt: { $max: "$updatedAt" }
      }
    },
    {
      $project: { _id: 0 }
    }
    ])
    if (getAllForms.length == 0) {
      return { success: false, message: messages.NO_DATA_FOUND }
    }
    return { success: true, message: messages.SUCCESS_RESPONSE, data: getAllForms }
  }

  async getFormData(data: GetFormDataDto): Promise<{ success: boolean, message: string, data?: Forms }> {
    const { formType, step } = data;
    const result = await this.formModel.aggregate([
      {
        $match: {
          formType: formType,
          step: step
        }
      },
      {
        $lookup: {
          from: 'formkeys',
          localField: '_id',
          foreignField: 'formId',
          as: 'formKeys',
          pipeline: [
            { $sort: { position: 1 } }
          ]
        }
      }
    ])
    return { success: true, message: messages.SUCCESS_RESPONSE, data: result[0] }
  }


  async getAllAccounts(data: GetAllAccountsDto): Promise<{ success: boolean, message: string, data?: object }> {
    const { page, limit, genderFilter, statusFilter, sortBy, sortType } = data
    let { search } = data

    const pageNumber = Number(page) || 1
    const limitNumber = Number(limit) || 10
    const offset = (pageNumber - 1) * limitNumber

    let matchingOptions: any = {}
    let matchingFilters: any = {}
    let sortOptions: any = {}

    if (search) {
      search = search.trim();
      console.log("search", search);
      matchingOptions = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          {
            $expr: {
              $regexMatch: {
                input: { $concat: ["$firstName", " ", "$lastName"] },
                regex: search,
                options: 'i',
              },
            },
          },
          // { status: search }
        ]
      }
    }
    console.log("matchingOptions", matchingOptions);
    if (genderFilter) {
      matchingFilters.gender = genderFilter
    }

    if (statusFilter) {
      matchingFilters.status = statusFilter
    }

    if (sortBy && sortType) {
      switch (sortBy) {
        case "1": sortOptions.lowerFullName = Number(sortType); break;
        case "2": sortOptions.candidateId = Number(sortType); break;
        case "3": sortOptions.submissionDate = Number(sortType); break;
      }
    } else {
      sortOptions.createdAt = -1
    }

    const getAllAccounts = await this.userModel.aggregate([
      { $match: { ...matchingOptions, ...matchingFilters } },
      {
        $addFields: {
          lowerFullName: { $toLower: { $concat: ["$firstName", " ", "$lastName"] } },
        }
      },
      {
        $facet: {
          totalCount: [{ $count: "count" }],
          data: [
            { $sort: sortOptions },
            { $skip: offset },
            { $limit: limitNumber }
          ]
        }
      },
      {
        $project: {
          totalCount: { $arrayElemAt: ["$totalCount.count", 0] },
          usersData: "$data"
        }
      }
    ])
    return { success: true, message: messages.ALL_ACCOUNTS_DATA, data: getAllAccounts[0] }
  }

  async getAccountDetails(data: GetAccountDetailsDto): Promise<{ success: boolean, message: string, data?: User }> {
    const checkUserExists = await this.userModel.findOne({ _id: data.userId })
    if (!checkUserExists) {
      return { success: false, message: messages.USER_NOT_FOUND }
    }

    const getAccountDetails = await this.userModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(data.userId) 
        }
      },
    ])
    return { success: true, message: messages.USER_DATA_FETCHED_SUCCESSFULLY, data: getAccountDetails[0] }
  }

}