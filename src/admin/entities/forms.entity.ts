import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


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
export class Forms extends Document {
  @Prop({ default: "" })
  formType: string;

  @Prop({ default: 1 })
  step: number;

  @Prop({ default: '' })
  keyName: string;

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
}

export const FormsSchema = SchemaFactory.createForClass(Forms);
