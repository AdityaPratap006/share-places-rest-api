export interface IPlace {
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