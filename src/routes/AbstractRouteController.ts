import { Router } from 'express';

export abstract class AbstractRouteController {

    router = Router();
    path!: string;

    public async InitializeController() {
        throw Error(`Endpoints not defined`);
    }

}
