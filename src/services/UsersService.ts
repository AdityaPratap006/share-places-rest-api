import { IUser, IUserModel, User } from '../models';
import { ServiceError } from '../utils/errors/ServiceError';
import { StatusConstants } from '../constants/StatusConstants';

export class UsersService {
    public static async getUsers(): Promise<IUserModel[]> {
        let users: IUserModel[] = [];

        try {
            users = await User.find();
        } catch (e) {
            const error = new ServiceError(`fetching users failed, please try again`, StatusConstants.CODE_500);
            throw error;
        }

        if (!users || users.length === 0) {
            const error = new ServiceError(`users not found`, StatusConstants.CODE_404);
            throw error;
        }

        return Promise.resolve(users.map(u => u.toObject({ getters: true })));
    }

    public static async signup(username: string, email: string, password: string): Promise<IUserModel> {

        let existingUser: IUserModel | null;

        try {
            existingUser = await User.findOne({ email: email });
        } catch (e) {
            const error = new ServiceError(`something went wrong, please try again`, StatusConstants.CODE_500);
            throw error;
        }

        if (existingUser) {
            const error = new ServiceError(`email already in use`, StatusConstants.CODE_500);
            throw error;
        }

        const createdUser = new User(<IUser>{
            name: username,
            email,
            password,
            image: `https://gritdaily.com/wp-content/uploads/2020/08/John-Wick.jpg`,
            places: '0',
        })

        try {
            await createdUser.save();
        } catch (e) {
            const error = new ServiceError(`signing up failed, please try again`, StatusConstants.CODE_500);
            throw error;
        }

        return Promise.resolve(createdUser.toObject({ getters: true }));
    }

    public static async login(email: string, password: string): Promise<IUserModel> {
        let identifiedUser: IUserModel | null;

        try {
            identifiedUser = await User.findOne({ email: email });
        } catch (e) {
            const error = new ServiceError(`something went wrong, please try again`, StatusConstants.CODE_500);
            throw error;
        }

        if (!identifiedUser || identifiedUser.password !== password) {
            const error = new ServiceError(`invalid credentials, please try again`, StatusConstants.CODE_401);
            throw error;
        }

        return Promise.resolve(identifiedUser);
    }
}