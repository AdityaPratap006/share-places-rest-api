import { Request, Response, NextFunction } from 'express';
import { AbstractRouteController } from './AbstractRouteController';
import { StatusConstants } from '../constants/StatusConstants';
import { PlacesService } from '../services/Places';
import { ServiceError } from '../utils/errors/ServiceError';

export class PlacesRouteController extends AbstractRouteController {

    constructor() {
        super();
        this.path = `/places`;
        this.InitializeController();
    }

    public async InitializeController() {
        await this.InitializeGetPlaceById();
        await this.InitializeGetAllPlaces();
        await this.InitializeGetUserPlaces();
    }

    public async InitializeGetPlaceById() {
        this.router.get(`${this.path}/:pid`, this.getPlaceById);
    }

    public async InitializeGetAllPlaces() {
        this.router.get(`${this.path}/`, this.getAllPlaces);
    }

    public async InitializeGetUserPlaces() {
        this.router.get(`${this.path}/user/:uid`, this.getUserPlaces);
    }

    public async getPlaceById(req: Request<{ pid: string }>, res: Response, next: NextFunction): Promise<void> {
        try {
            const placeId = req.params.pid;
            const place = await PlacesService.getPlace(placeId);

            res.status(StatusConstants.CODE_200).json({ place });

        } catch (e) {
            const error = e as ServiceError;
            next(error);
        }
    }

    public async getAllPlaces(_: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const places = await PlacesService.getAll();

            res.status(StatusConstants.CODE_200).json({ places });

        } catch (e) {
            const error = e as ServiceError;
            next(error);
        }
    }

    public async getUserPlaces(req: Request<{ uid: string }>, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.uid;
            const userPlaces = await PlacesService.getPlacesByUser(userId);

            res.status(StatusConstants.CODE_200).json({ places: userPlaces });
        } catch (e) {
            const error = e as ServiceError;
            next(error);
        }
    }
}