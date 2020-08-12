import { Request, Response } from 'express';
import { AbstractRouteController } from '../AbstractRouteController';
import { StatusConstants } from '../../constants/StatusConstants';

export class HelloWorldRouteController extends AbstractRouteController {

    constructor() {
        super();
        this.path = `/helloworld`;
        this.InitializeController();
    }

    public async runService(req: Request, res: Response): Promise<any> {

        const response = `Hello There!!`;

        res.status(StatusConstants.CODE_200).send(response);
    }
}