import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ServiceError } from '../utils/errors/ServiceError';
import { StatusConstants } from '../constants/StatusConstants';
import { UserResponseData } from '../models';

declare global {
    namespace Express {
        export interface Request {
            userData?: {
                userId: string;
            };
        }
    }
}

export class AuthMiddleware {
    public static async useAuth(req: Request, _res: Response, next: NextFunction) {

        if (req.method === 'OPTIONS') {
            next();
            return;
        }

        try {
            const authToken = req.headers.authorization;

            if (!authToken) {
                throw new Error();
            }

            const token = authToken.split(' ')[1];

            if (!token) {
                throw new Error();
            }

            const decodedToken = <UserResponseData>jwt.verify(token, 'supersecret_dont_share');
            req.userData = { userId: decodedToken.userId };
            next();
        } catch (e) {
            const error = new ServiceError(`Authentication failed!`, StatusConstants.CODE_401);
            next(error);
            return;
        }
    };
}