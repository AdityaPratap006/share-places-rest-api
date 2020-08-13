export interface Place {
    id: string;
    imageURL: string;
    title: string;
    description: string;
    address: string;
    creatorId: string;
    location: {
        lat: number;
        lng: number;
    };
}

export interface PlacePostRequestBody {
    title: string;
    description: string;
    address: string;
    creatorId: string;
    coordinates: {
        lat: number;
        lng: number;
    };
}