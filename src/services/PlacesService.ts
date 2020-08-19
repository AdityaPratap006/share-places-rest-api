import mongoose from 'mongoose';
import { IPlace, IPlaceModel, Place, User, IUserModel } from '../models';
import { ServiceError } from '../utils/errors/ServiceError';
import { StatusConstants } from '../constants/StatusConstants';
import { getCoordinatesForAddress } from '../utils/googleMapsGeoCoding';

export class PlacesService {
    public static async getPlace(placeId: string): Promise<IPlaceModel> {
        let place: IPlaceModel | null;

        try {
            place = await Place.findById(placeId);
        } catch (e) {
            const error = new ServiceError(`fetching place failed, please try again`, StatusConstants.CODE_500);
            throw error;
        }

        if (!place) {
            const error = new ServiceError(`place not found`, StatusConstants.CODE_404);
            throw error;
        }

        return Promise.resolve(place.toObject({ getters: true }));
    }

    public static async getAll(): Promise<IPlace[]> {
        let places: IPlaceModel[] = [];

        try {
            places = await Place.find();
        } catch (e) {
            const error = new ServiceError(`fetching places failed, please try again`, StatusConstants.CODE_500);
            throw error;
        }

        if (!places || places.length === 0) {
            const error = new ServiceError(`places not found`, StatusConstants.CODE_404);
            throw error;
        }

        return Promise.resolve(places.map(placeModel => placeModel.toObject({ getters: true })));
    }

    public static async getPlacesByUser(userId: string): Promise<IPlaceModel[]> {
        let userPlaces: IPlaceModel[] = [];

        try {
            userPlaces = await Place.find({ creatorId: userId });
        } catch (e) {
            const error = new ServiceError(`fetching places failed, please try again`, StatusConstants.CODE_500);
            throw error;
        }

        if (!userPlaces || userPlaces.length === 0) {
            const error = new ServiceError(`could not find places for the provided user id`, StatusConstants.CODE_404);
            throw error;
        }

        return Promise.resolve(userPlaces.map(placeModel => placeModel.toObject({ getters: true })));
    }

    public static async createPlace(placeData: IPlace): Promise<IPlaceModel> {

        const coordinates = await getCoordinatesForAddress(placeData.address);

        const createdPlace = new Place(<IPlace>{
            title: placeData.title,
            description: placeData.description,
            address: placeData.address,
            imageURL: `https://media.tacdn.com/media/attractions-splice-spp-674x446/07/be/ec/eb.jpg`,
            location: coordinates,
            creatorId: placeData.creatorId,
        });

        let user: IUserModel | null;
        try {
            user = await User.findById(placeData.creatorId);
        } catch (e) {
            const error = new ServiceError(`creating place failed, please try again`, StatusConstants.CODE_500);
            throw error;
        }

        if (!user) {
            const error = new ServiceError(`could not find user for provided creatorId`, StatusConstants.CODE_404);
            throw error;
        }

        try {
            const session = await mongoose.startSession();
            session.startTransaction();
            await createdPlace.save({ session: session });
            user.places.push(createdPlace.id);
            await user.save({ session: session });
            await session.commitTransaction();

        } catch (e) {
            const error = new ServiceError(`creating place failed, please try again`, StatusConstants.CODE_500);
            throw error;
        }

        return Promise.resolve(createdPlace.toObject({ getters: true }));
    }

    public static async modifyPlace(placeId: string, placeData: IPlace): Promise<IPlaceModel> {
        const { title, description } = placeData;

        let placeToBeUpdated: IPlaceModel | null = null;
        try {
            placeToBeUpdated = await Place.findById(placeId);

        } catch (e) {
            const error = new ServiceError(`something went wrong, please try again`, StatusConstants.CODE_500);
            throw error;
        }

        if (!placeToBeUpdated) {
            const error = new ServiceError(`place not found`, StatusConstants.CODE_404);
            throw error;
        }

        placeToBeUpdated.title = title;
        placeToBeUpdated.description = description;

        try {
            await placeToBeUpdated.save();

        } catch (e) {
            const error = new ServiceError(`could not update the place, please try again`, StatusConstants.CODE_500);
            throw error;
        }

        return Promise.resolve(placeToBeUpdated.toObject({ getters: true }));
    }

    public static async removePlace(placeId: string): Promise<void> {
        let placeToBeDeleted: IPlaceModel | null = null;
        try {
            placeToBeDeleted = await Place.findById(placeId);

        } catch (e) {
            const error = new ServiceError(`something went wrong, please try again`, StatusConstants.CODE_500);
            throw error;
        }

        if (!placeToBeDeleted) {
            const error = new ServiceError(`place not found`, StatusConstants.CODE_404);
            throw error;
        }

        try {
            await placeToBeDeleted.remove();
        } catch (e) {
            const error = new ServiceError(`could not delete the place, please try again`, StatusConstants.CODE_500);
            throw error;
        }
    }
}