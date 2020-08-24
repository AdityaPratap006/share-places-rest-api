import { Schema, model, Document, Types } from 'mongoose';
import { type } from 'os';
export interface IPlace {
    title: string;
    description: string;
    address: string;
    imageURL: string;
    imageId: string;
    creatorId: string;
    location: {
        lat: number;
        lng: number;
    };
}

export interface IPlaceRequest {
    title: string;
    description: string;
    address: string;
    imageFileString: string;
    creatorId: string;
}

export interface IPlaceModel extends IPlace, Document {

}

export const PlaceSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    imageURL: { type: String, required: true },
    creatorId: { type: Types.ObjectId, required: true, ref: 'User' },
    imageId: { type: String, required: true },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
    },
});

export const Place = model<IPlaceModel>('Place', PlaceSchema);
