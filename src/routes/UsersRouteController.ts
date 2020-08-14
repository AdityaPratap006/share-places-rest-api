import { Request, Response, NextFunction } from 'express';
import { AbstractRouteController } from './AbstractRouteController';
import { StatusConstants } from '../constants/StatusConstants';
import { UsersService } from '../services/UsersService';
import { ServiceError } from '../utils/errors/ServiceError';
import { User } from '../models';

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
        this.router.post(`${this.path}/signup`, this.signupUser);
    }

    public async InitializeLogin() {
        this.router.post(`${this.path}/login`, this.loginUser);
    }

    public async getUsers(req: Request, res: Response, next: NextFunction) {

    }

    public async signupUser(req: Request, res: Response, next: NextFunction) {

    }

    public async loginUser(req: Request, res: Response, next: NextFunction) {

    }
}