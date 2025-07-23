import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "./user.entity";
import { Document, Types } from "mongoose";
import { MediaType } from "src/helpers/enums";

@Schema({timestamps: true})
export class Media extends Document {

    @Prop({type: Types.ObjectId, ref: User.name, default: null})
    userId: Types.ObjectId;

    @Prop({default: ""})
    url: string;

    @Prop({enum: MediaType, default: MediaType.IMAGE})
    type: MediaType;

    @Prop({default: false})
    isPrimary: boolean;

    @Prop({default: false})
    isDefault: boolean;

    @Prop({default: false})
    showBlurredOnProfile: boolean;

    @Prop({default: false})
    showOnProfile: boolean;
}

export const MediaSchema = SchemaFactory.createForClass(Media)