import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsLowercase, IsMongoId, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";


export class OptionsValueDto {
    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    label: string
   
    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    value: string

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isVisible: boolean

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    position: number
}



export class FormsDataDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    keyName: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    label: string

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    isVisible: boolean

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    isRequired: boolean

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    type: string

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    position: number

    @ApiProperty({
        type: [OptionsValueDto],
        description: 'Array of options value objects',
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OptionsValueDto)
    optionsValue: OptionsValueDto[]

    @ApiProperty()
    @IsOptional()
    @IsObject()
    rules: object
}




export class FormDto {

    @ApiProperty()
    @IsNotEmpty()
    @IsLowercase()
    @IsString()
    formType: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    step: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    title: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    subtitle: string

    @ApiProperty({
        type: [FormsDataDto],
        description: 'Array of form data objects',
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FormsDataDto)
    formData: FormsDataDto[]

}


export class GetFormDataDto{
    
    @ApiProperty()
    @IsNotEmpty()
    @IsLowercase()
    @IsString()
    formType: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    step: string

}

export class GetAllAccountsDto{

    @ApiProperty()
    @IsOptional()
    @IsString()
    page: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    limit: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    search: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    genderFilter: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    statusFilter: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    sortBy: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    sortType: string
}

export class GetAccountDetailsDto{
    @IsNotEmpty()
    @IsMongoId()
    @IsString()
    userId: string
}

export class UpdateAccountDto{
    @IsNotEmpty()
    @IsString()
    @IsMongoId()
    userId: string
}