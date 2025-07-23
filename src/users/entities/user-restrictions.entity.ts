import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "./user.entity";
import { UserRestrictionType } from "src/helpers/enums";

@Schema({ timestamps: true })
export class UserRestrictions extends Document {
    @Prop({ type: Types.ObjectId, ref: User.name, default: null })
    userId: Types.ObjectId;

    @Prop({ enum: UserRestrictionType, default: UserRestrictionType.BLOCKED })
    type: UserRestrictionType;

    @Prop({ type: Types.ObjectId, ref: User.name, default: null })
    restrictedBy: Types.ObjectId;

    @Prop({ default: "" })
    reason: string;

    @Prop({ default: 0 })
    duration: number;

    @Prop({ default: null })
    expiresAt: Date;
}

export const UserRestrictionsSchema = SchemaFactory.createForClass(UserRestrictions)