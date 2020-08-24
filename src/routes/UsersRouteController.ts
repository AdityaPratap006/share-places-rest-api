import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import { AbstractRouteController } from './AbstractRouteController';
import { StatusConstants } from '../constants/StatusConstants';
import { UsersService } from '../services/UsersService';
import { ServiceError } from '../utils/errors/ServiceError';

interface UserSignupData {
    username: string;
    email: string;
    password: string;
    profilePic: string;
}

interface UserLoginData {
    email: string;
    password: string;
}

export class UsersRouteController extends AbstractRouteController {
    constructor() {
        super();
        this.path = `/users`;
        this.InitializeController();
    }

    public async InitializeController() {
        await this.InitializeGetUsers();
        await this.InitializeSignup();
        await this.InitializeLogin();
    }

    public async InitializeGetUsers() {
        this.router.get(`${this.path}/`, this.getUsers);
    }

    public async InitializeSignup() {
        this.router.post(
            `${this.path}/signup`,
            [
                check('username').not().isEmpty(),
                check('email').normalizeEmail().isEmail(),
                check('password').isLength({ min: 6 }),
                // check('profilePic').not().isEmpty(),
            ],
            this.signupUser
        );
    }

    public async InitializeLogin() {
        this.router.post(`${this.path}/login`, this.loginUser);
    }

    public async getUsers(_req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UsersService.getUsers();
            res.status(StatusConstants.CODE_200).json({ users });
        } catch (e) {
            const error = e as ServiceError;
            next(error);
        }
    }

    public async signupUser(req: Request<{}, {}, UserSignupData>, res: Response, next: NextFunction) {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            const error = new ServiceError(`Invalid inputs passed, please check your data.`, StatusConstants.CODE_422);
            next(error);
            return;
        }

        const { username, email, password, profilePic } = req.body;
        try {
            const createdUser = await UsersService.signup(username, email, password, profilePic);
            res.status(StatusConstants.CODE_201).json({ ...createdUser });
        } catch (e) {
            const error = e as ServiceError;
            next(error);
        }
    }

    public async loginUser(req: Request<{}, {}, UserLoginData>, res: Response, next: NextFunction) {
        const { email, password } = req.body;

        try {
            const user = await UsersService.login(email, password);
            res.status(StatusConstants.CODE_200).json({ ...user });
        } catch (e) {
            const error = e as ServiceError;
            next(error);
        }
    }
}