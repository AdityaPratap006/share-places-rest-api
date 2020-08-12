import { Place } from '../models';

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
            throw Error(`place not found!`);
        }

        return Promise.resolve(place);
    }
}