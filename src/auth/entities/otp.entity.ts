import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ timestamps: true })
export class Otp extends Document {
   @Prop({default: ""})
    email: string;

    @Prop({default: ""})
    otp: string;

    @Prop({default: ""})
    backupEmail: string;

    @Prop({default: ""})
    phoneNumber: string;

    @Prop({default: ""})
    createdAt: Date;

    @Prop({default: ""})
    expiresAt: Date;
}

export const OtpSchema = SchemaFactory.createForClass(Otp)