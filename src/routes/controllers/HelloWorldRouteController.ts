import { Request, Response } from 'express';
import { AbstractRouteController } from '../AbstractRouteController';
import { StatusConstants } from '../../constants/StatusConstants';
import { HelloWorld } from '../../services/HelloWorld';
export class HelloWorldRouteController extends AbstractRouteController {

    constructor() {
        super();
        this.path = `/helloworld`;
        this.InitializeController();
    }

    public async runService(req: Request, res: Response): Promise<any> {

        const response = await HelloWorld.wishHello();

        res.status(StatusConstants.CODE_200).send(response);
    }
}