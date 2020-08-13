import { Place, PlacePostRequestBody } from '../models';
import { ServiceError } from '../utils/errors/ServiceError';
import { StatusConstants } from '../constants/StatusConstants';

const DUMMY_PLACES: Place[] = [
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
    public static async getPlace(placeId: string): Promise<Place> {
        const place = DUMMY_PLACES.find(pl => pl.id === placeId);

        if (!place) {
            const error = new ServiceError(`place not found!`, StatusConstants.CODE_404);
            throw error;
        }

        return Promise.resolve(place);
    }

    public static async getAll(): Promise<Place[]> {
        const places = DUMMY_PLACES;

        if (!places) {
            const error = new ServiceError(`places not found!`, StatusConstants.CODE_404);
            throw error;
        }

        return Promise.resolve(places);
    }

    public static async getPlacesByUser(userId: string): Promise<Place[]> {
        const userPlaces = DUMMY_PLACES.filter(pl => pl.creatorId === userId);

        if (!userPlaces) {
            const error = new ServiceError(`places not found!`, StatusConstants.CODE_404);
            throw error;
        }

        return Promise.resolve(userPlaces);
    }

    public static async createPlace(placeData: PlacePostRequestBody): Promise<void> {
        const place: Place = {
            title: placeData.title,
            address: placeData.address,
            creatorId: placeData.creatorId,
            description: placeData.description,
            location: placeData.coordinates,
            id: `p${DUMMY_PLACES.length + 1}`,
            imageURL: `dummy-url-${placeData.title}`,
        };

        DUMMY_PLACES.push(place);
    }
}