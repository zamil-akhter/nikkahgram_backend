import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { LoginTypeEnum, ReferenceCreatedBy, ReferenceStatus, ReferenceType, userRole } from "src/helpers/enums";
import { User } from "./user.entity";

@Schema({ timestamps: true })
export class Reference extends Document {
    @Prop({ type: Types.ObjectId, ref: User.name, default: null })                    //null if its created by admin
    userId: Types.ObjectId;

    @Prop({enum: ReferenceCreatedBy, default: ReferenceCreatedBy.USER })
    createdBy: string;                                                            

    @Prop({type: Types.ObjectId, ref: User.name, default: null})
    assignedTo: Types.ObjectId;

    @Prop({ default: "" })
    name: string;

    @Prop({ default: "" })
    relationship: string;

    @Prop({ default: "" })
    countryCode: string;

    @Prop({ default: "" })
    phoneNumber: string;

    @Prop({default: ""})
    otherDetails: string;

    @Prop({default: ""})
    gender: string;

    @Prop({enum: ReferenceType, default: ReferenceType.M1 })
    type: string;

    @Prop({enum: ReferenceStatus, default: ReferenceStatus.USERSAVED })
    status: string;

}

export const ReferenceSchema = SchemaFactory.createForClass(Reference)