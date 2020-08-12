import { Request, Response } from 'express';
import { AbstractRouteController } from '../../AbstractRouteController';
import { StatusConstants } from '../../../constants/StatusConstants';
// --import the required service here--

export class GetPlaceRouteController extends AbstractRouteController {

    constructor() {
        super();
        this.path = `/places/:pid`;
        this.InitializeController();
    }

    public async runService(req: Request<{ pid: string }>, res: Response): Promise<any> {

        const placeId = req.params.pid;

        const response = {
            placeId,
        };

        res.status(StatusConstants.CODE_200).send(response);
    }
}