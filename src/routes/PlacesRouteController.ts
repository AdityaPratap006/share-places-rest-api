import { Request, Response } from 'express';
import { AbstractRouteController } from './AbstractRouteController';
import { StatusConstants } from '../constants/StatusConstants';
import { PlacesService } from '../services/Places';

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

    public async getPlaceById(req: Request<{ pid: string }>, res: Response): Promise<void> {
        try {
            const placeId = req.params.pid;
            const place = await PlacesService.getPlace(placeId);

            res.status(StatusConstants.CODE_200).json({ place });

        } catch (error) {

            res.status(StatusConstants.CODE_404).json({
                error: (error as Error).message,
            });
        }
    }

    public async getAllPlaces(_: Request, res: Response): Promise<void> {
        try {
            const places = await PlacesService.getAll();

            res.status(StatusConstants.CODE_200).json({ places });

        } catch (error) {

            res.status(StatusConstants.CODE_404).json({
                error: (error as Error).message,
            });
        }
    }

    public async getUserPlaces(req: Request<{ uid: string }>, res: Response): Promise<void> {
        try {
            const userId = req.params.uid;
            const userPlaces = await PlacesService.getPlacesByUser(userId);

            res.status(StatusConstants.CODE_200).json({ places: userPlaces });
        } catch (error) {

            res.status(StatusConstants.CODE_404).json({
                error: (error as Error).message,
            });
        }
    }
}