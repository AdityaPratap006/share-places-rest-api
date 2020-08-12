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
    }

    public async InitializeGetPlaceById() {
        this.router.get(`${this.path}/:pid`, this.getPlaceById);
    }

    public async InitializeGetAllPlaces() {
        this.router.get(`${this.path}/`, this.getAllPlaces);
    }

    public async getPlaceById(req: Request<{ pid: string }>, res: Response): Promise<void> {

        const placeId = req.params.pid;

        try {
            const response = await PlacesService.getPlace(placeId);

            res.status(StatusConstants.CODE_200).json(response);

        } catch (error) {

            res.status(StatusConstants.CODE_404).json({
                error: (error as Error).message,
            });
        }
    }

    public async getAllPlaces(req: Request, res: Response): Promise<void> {
        try {
            const places = await PlacesService.getAll();

            res.status(StatusConstants.CODE_200).json(places);

        } catch (error) {

            res.status(StatusConstants.CODE_404).json({
                error: (error as Error).message,
            });
        }
    }
}