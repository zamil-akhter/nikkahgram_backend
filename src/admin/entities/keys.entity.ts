import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Forms } from './forms.entity';


@Schema({timestamps: true})
export class OptionsValue extends Document{
    @Prop({default: ""})
    name: string

    @Prop({default: true})
    isVisible: boolean

    @Prop({default: 1})
    position: number
}

const OptionsValueSchema = SchemaFactory.createForClass(OptionsValue);

@Schema({ timestamps: true })
export class FormKeys extends Document {

  @Prop({type: Types.ObjectId, ref: Forms.name, default: null})
  formId: Types.ObjectId

  @Prop({ default: "" })
  keyName: string;

  @Prop({ default: "" })
  label: string;

  @Prop({ default: true })
  isVisible: boolean;

  @Prop({ default: false })
  isRequired: boolean;

  @Prop({ default: "" })
  type: string;

  @Prop({ default: 1 })
  position: number;

  @Prop({ default: null })
  optionsValues: OptionsValue[];

  @Prop({ type: Object, default: {} })
  rules: object;
}

export const FormKeysSchema = SchemaFactory.createForClass(FormKeys);
