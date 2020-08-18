import * as uuid from 'uuid';
import { IPlace } from '../models';
import { ServiceError } from '../utils/errors/ServiceError';
import { StatusConstants } from '../constants/StatusConstants';
import { getCoordinatesForAddress } from '../utils/googleMapsGeoCoding';

const DUMMY_PLACES: IPlace[] = [
    {
        id: 'p1',
        title: 'Times Square',
        address: 'New York',
        description: 'Beautiful New York',
        creatorId: 'u2',
        imageURL: `https://akm-img-a-in.tosshub.com/sites/btmt/images/stories/times_square_505_040820090248.jpg?size=1200:675`,
        location: {
            lat: 40.758896,
            lng: -73.985130,
        }
    },
    {
        id: 'p2',
        title: 'Burj Khalifa',
        address: 'Dubai',
        description: 'Beautiful Dubai',
        creatorId: 'u2',
        imageURL: `https://media.tacdn.com/media/attractions-splice-spp-674x446/07/be/ec/eb.jpg`,
        location: {
            lat: 25.197525,
            lng: 55.274288,
        }
    },
];

export class PlacesService {
    public static async getPlace(placeId: string): Promise<IPlace> {
        const place = DUMMY_PLACES.find(pl => pl.id === placeId);

        if (!place) {
            const error = new ServiceError(`place not found!`, StatusConstants.CODE_404);
            throw error;
        }

        return Promise.resolve(place);
    }

    public static async getAll(): Promise<IPlace[]> {
        const places = DUMMY_PLACES;

        if (!places || places.length === 0) {
            const error = new ServiceError(`places not found!`, StatusConstants.CODE_404);
            throw error;
        }

        return Promise.resolve(places);
    }

    public static async getPlacesByUser(userId: string): Promise<IPlace[]> {
        const userPlaces = DUMMY_PLACES.filter(pl => pl.creatorId === userId);

        if (!userPlaces || userPlaces.length === 0) {
            const error = new ServiceError(`places not found!`, StatusConstants.CODE_404);
            throw error;
        }

        return Promise.resolve(userPlaces);
    }

    public static async createPlace(placeData: IPlace): Promise<IPlace> {

        const coordinates = await getCoordinatesForAddress(placeData.address);

        const place: IPlace = {
            id: uuid.v4(),
            title: placeData.title,
            address: placeData.address,
            creatorId: placeData.creatorId,
            description: placeData.description,
            imageURL: `dummy-url-${placeData.title}`,
            location: coordinates,
        };

        DUMMY_PLACES.push(place);

        return Promise.resolve(place);
    }

    public static async modifyPlace(placeId: string, placeData: IPlace): Promise<IPlace> {
        const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);

        if (placeIndex === -1) {
            const error = new ServiceError(`place not found!`, StatusConstants.CODE_404);
            throw error;
        }

        const { title, description } = placeData;

        const updatedPlace: IPlace = {
            ...DUMMY_PLACES[placeIndex],
            title,
            description,
        };

        DUMMY_PLACES[placeIndex] = updatedPlace;

        return Promise.resolve(updatedPlace);
    }

    public static async removePlace(placeId: string): Promise<void> {
        const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);

        if (placeIndex === -1) {
            const error = new ServiceError(`place not found!`, StatusConstants.CODE_404);
            throw error;
        }

        DUMMY_PLACES.splice(placeIndex, 1);
    }
}