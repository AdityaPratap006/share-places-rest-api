import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser, IUserModel, User } from '../models';
import { ServiceError } from '../utils/errors/ServiceError';
import { StatusConstants } from '../constants/StatusConstants';
import { cloudinary } from '../utils/cloudinaryImageUpload';

interface UserResponseData {
    userId: string;
    email: string;
    token: string;
}

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

    public static async signup(username: string, email: string, password: string, profilePicFileString: string): Promise<UserResponseData> {

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

        let token: string | undefined;
        try {
            token = jwt.sign({
                userId: createdUser.id,
                email: createdUser.email,
            }, 'supersecret_dont_share', { expiresIn: '2h', });
        } catch (e) {
            const error = new ServiceError(`signing up failed, please try again`, StatusConstants.CODE_500);
            throw error;
        }

        const userResponse: UserResponseData = {
            userId: createdUser.id,
            email: createdUser.email,
            token: token,
        };

        return Promise.resolve(userResponse);
    }

    public static async login(email: string, password: string): Promise<UserResponseData> {
        let identifiedUser: IUserModel | null;

        try {
            identifiedUser = await User.findOne({ email: email });
        } catch (e) {
            const error = new ServiceError(`something went wrong, please try again`, StatusConstants.CODE_500);
            throw error;
        }

        if (!identifiedUser) {
            const error = new ServiceError(`invalid credentials, please try again`, StatusConstants.CODE_401);
            throw error;
        }

        let isValidPassword = false;
        try {
            isValidPassword = await bcrypt.compare(password, identifiedUser.password);
        } catch (e) {
            const error = new ServiceError(`something went wrong, please try again`, StatusConstants.CODE_500);
            throw error;
        }

        if (!isValidPassword) {
            const error = new ServiceError(`invalid credentials, please try again`, StatusConstants.CODE_401);
            throw error;
        }

        let token: string | undefined;
        try {
            token = jwt.sign({
                userId: identifiedUser.id,
                email: identifiedUser.email,
            }, 'supersecret_dont_share', { expiresIn: '2h', });
        } catch (e) {
            const error = new ServiceError(`logging in failed, please try again`, StatusConstants.CODE_500);
            throw error;
        }

        const userResponse: UserResponseData = {
            userId: identifiedUser.id,
            email: identifiedUser.email,
            token: token,
        };

        return Promise.resolve(userResponse);
    }
}