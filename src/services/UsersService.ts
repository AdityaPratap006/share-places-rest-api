import * as uuid from 'uuid';
import { IUser } from '../models';
import { ServiceError } from '../utils/errors/ServiceError';
import { StatusConstants } from '../constants/StatusConstants';

const USERS: IUser[] = [
    {
        id: 'u1',
        name: 'Aditya Pratap',
        email: 'adityapratap7344@gmail.com',
        password: '123456',
        image: 'https://lh3.googleusercontent.com/a-/AOh14Giua5GTdH5D9SE1g_dudgXu6Pq6YD8-xA5QbG1lEg',
    },
    {
        id: 'u2',
        name: 'John Wick',
        email: 'johnwick@gmail.com',
        password: '123456',
        image: 'data:image/jpeg;base64,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',
    },
];

export class UsersService {
    public static async getUsers(): Promise<IUser[]> {
        const users = USERS;

        if (!users || users.length === 0) {
            const error = new ServiceError(`users not found`, StatusConstants.CODE_404);
            throw error;
        }

        return Promise.resolve(users);
    }

    public static async signup(username: string, email: string, password: string): Promise<IUser> {

        const existingUser = USERS.find(u => u.email === email);

        if (existingUser) {
            const error = new ServiceError(`could not create user, email already exists.`, StatusConstants.CODE_401);
            throw error;
        }

        const createdUser: IUser = {
            id: uuid.v4(),
            name: username,
            email,
            password,
            image: '',
        };

        USERS.push(createdUser);

        return Promise.resolve(createdUser);
    }

    public static async login(email: string, password: string): Promise<IUser> {
        const identifiedUser = USERS.find(u => u.email === email);

        if (identifiedUser === undefined || identifiedUser.password !== password) {
            const error = new ServiceError(`could not identify user, credential seems to be wrong.`, StatusConstants.CODE_401);
            throw error;
        }

        return Promise.resolve(identifiedUser);
    }
}