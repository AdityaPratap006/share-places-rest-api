import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import { AbstractRouteController } from './AbstractRouteController';
import { StatusConstants } from '../constants/StatusConstants';
import { PlacesService } from '../services/PlacesService';
import { ServiceError } from '../utils/errors/ServiceError';
import { IPlaceRequest } from '../models';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

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

        await this.InitializeAuthMiddleware();

        await this.InitializePostPlace();
        await this.InitializeUpdatePlace();
        await this.InitializeDeletePlace();
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

    public async InitializeAuthMiddleware() {
        this.router.use(AuthMiddleware.useAuth);
    }

    public async InitializePostPlace() {
        this.router.post(
            `${this.path}/`,
            [
                check('title').not().isEmpty(),
                check('description').isLength({ min: 5 }),
                check('address').not().isEmpty(),
            ],
            this.postPlace
        );
    }

    public async InitializeUpdatePlace() {
        this.router.patch(
            `${this.path}/:pid`,
            [
                check('title').not().isEmpty(),
                check('description').isLength({ min: 5 }),
            ],
            this.updatePlace
        );
    }

    public async InitializeDeletePlace() {
        this.router.delete(`${this.path}/:pid`, this.deletePlace);
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

    public async postPlace(req: Request<{}, {}, IPlaceRequest>, res: Response, next: NextFunction): Promise<void> {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            const error = new ServiceError(`Invalid inputs passed, please check your data.`, StatusConstants.CODE_422);
            next(error);
            return;
        }

        let placeData = req.body;

        placeData = {
            ...placeData,
            creatorId: <string>req.userData?.userId,
        }

        try {
            const place = await PlacesService.createPlace(placeData);

            res.status(StatusConstants.CODE_201).json({ place });
        } catch (e) {
            const error = e as ServiceError;
            next(error);
        }

    }

    public async updatePlace(req: Request<{ pid: string }, {}, IPlaceRequest>, res: Response, next: NextFunction): Promise<void> {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            const error = new ServiceError(`Invalid inputs passed, please check your data.`, StatusConstants.CODE_422);
            next(error);
            return;
        }

        const placeId = req.params.pid;
        const placeData = req.body;

        try {
            const place = await PlacesService.modifyPlace(placeId, placeData, req.userData?.userId as string);

            res.status(StatusConstants.CODE_200).json({ place });
        } catch (e) {
            const error = e as ServiceError;
            next(error);
        }
    }

    public async deletePlace(req: Request<{ pid: string }>, res: Response, next: NextFunction): Promise<void> {
        const placeId = req.params.pid;

        try {
            await PlacesService.removePlace(placeId, req.userData?.userId as string);

            res.status(StatusConstants.CODE_200).json({
                message: `deleted place with id: ${placeId}`,
            });
        } catch (e) {
            const error = e as ServiceError;
            next(error);
        }
    }
}