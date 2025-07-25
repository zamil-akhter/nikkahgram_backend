import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";


export class OptionsValueDto {
    @IsNotEmpty()
    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsNotEmpty()
    @IsBoolean()
    isVisible: boolean

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    position: string
}



export class FormsDataDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    formType: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    step: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    keyName: string

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
    @IsString()
    position: string

    @ApiProperty({
        type: [OptionsValueDto],
        description: 'Array of options value objects',
    })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OptionsValueDto)
    optionsValue: OptionsValueDto[]
}




export class FormDto {

    @ApiProperty({
        type: [FormsDataDto],
        description: 'Array of form data objects',
    })
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FormsDataDto)
    formData: FormsDataDto[]

}


export class GetFormDataDto{
    
    @ApiProperty()
    @IsNotEmpty()
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
    filter: string
}