import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Forms extends Document {
  @Prop({ default: "" })
  formType: string;

  @Prop({ default: "1" })
  step: string;

  @Prop({ default: "" })
  title: string;

  @Prop({ default: "" })
  subtitle: string;
}

export const FormsSchema = SchemaFactory.createForClass(Forms);