import { Request, Response } from 'express';
import { AbstractRouteController } from '../AbstractRouteController';
import { StatusConstants } from '../../constants/StatusConstants';
import { PlacesService } from '../../services/Places';

export class PlacesRouteController extends AbstractRouteController {

    constructor() {
        super();
        this.path = `/places/:pid`;
        this.InitializeController();
    }

    public async runService(req: Request<{ pid: string }>, res: Response): Promise<any> {

        const placeId = req.params.pid;

        try {
            const response = await PlacesService.getPlaceById(placeId);

            res.status(StatusConstants.CODE_200).json(response);

        } catch (error) {

            res.status(StatusConstants.CODE_404).json({
                error: (error as Error).message,
            });
        }
    }
}