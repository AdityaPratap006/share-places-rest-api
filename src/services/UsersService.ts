import bcrypt from 'bcryptjs';
import { IUser, IUserModel, User } from '../models';
import { ServiceError } from '../utils/errors/ServiceError';
import { StatusConstants } from '../constants/StatusConstants';
import { cloudinary } from '../utils/cloudinaryImageUpload';

export class UsersService {
    public static async getUsers(): Promise<IUserModel[]> {
        let users: IUserModel[] = [];

        try {
            users = await User.find({}, '-password');
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

    public static async signup(username: string, email: string, password: string, profilePicFileString: string): Promise<IUserModel> {

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

        let profilePicUrl: string | undefined;
        let profilePicId: string | undefined;
        try {
            const uploadResponse = await cloudinary.uploader.upload(profilePicFileString, {
                upload_preset: 'users',
            });

            profilePicUrl = uploadResponse.secure_url;
            profilePicId = uploadResponse.public_id;

        } catch (e) {
            const error = new ServiceError(`something went wrong, please try again`, StatusConstants.CODE_500);
            throw error;
        }

        let hashedPassword: string | undefined;
        try {
            hashedPassword = await bcrypt.hash(password, 12);
        } catch (e) {
            const error = new ServiceError(`signing up failed, please try again`, StatusConstants.CODE_500);
            throw error;
        }

        const createdUser = new User(<IUser>{
            name: username,
            email,
            password: hashedPassword,
            profilePic: profilePicUrl,
            profilePicId: profilePicId,
            places: [],
        });

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

        return Promise.resolve(identifiedUser.toObject({ getters: true }));
    }
}