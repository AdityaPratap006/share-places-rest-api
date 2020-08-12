import { Express } from 'express';
import {
    AbstractRouteController,
    HelloWorldRouteController,
    PlacesRouteController
} from '../routes';

export class InitializeRoutes {

    public static async Initialze(app: Express) {
        let routes = await this.getRoutes();
        routes.forEach(routeController => {
            app.use(`/`, routeController.router);
        });
    }

    public static async getRoutes(): Promise<AbstractRouteController[]> {
        let routes: AbstractRouteController[] = [];

        routes.push(new HelloWorldRouteController());
        routes.push(new PlacesRouteController());

        return Promise.resolve(routes);
    }

}