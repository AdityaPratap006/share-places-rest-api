import { Schema, Document, model, Types } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
export interface IUser {
    name: string;
    email: string;
    password: string;
    profilePic: string;
    profilePicId: string;
    places: string[];
}

export interface IUserModel extends IUser, Document {

}

export const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, required: true },
    places: [{ type: Types.ObjectId, required: true, ref: 'Place' }],
});

UserSchema.plugin(uniqueValidator);

export const User = model<IUserModel>('User', UserSchema);