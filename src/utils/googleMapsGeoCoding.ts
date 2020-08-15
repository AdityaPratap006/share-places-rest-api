import axios from 'axios';
import { ServiceError } from './errors/ServiceError';
import { StatusConstants } from '../constants/StatusConstants';
import { config } from 'dotenv';
import { resolve } from 'path';

config({
    path: resolve(__dirname, "../../.env"),
});

const API_KEY = process.env['GOOGLE_API_KEY'];

export const getCoordinatesForAddress = async (address: string) => {
    const URL = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`;

    const response = await axios.get(URL);

    const data = response.data;

    if (!data || data.status === 'ZERO_RESULTS') {
        const error = new ServiceError(
            `could not find location for the specified address.`,
            StatusConstants.CODE_422
        );
        throw error;
    }

    const coordinates = data.results[0].geometry.location;

    return coordinates as { lat: number; lng: number; };
}