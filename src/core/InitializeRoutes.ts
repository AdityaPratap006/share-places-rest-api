import { Express } from 'express';
import {
    AbstractRouteController,
    PlacesRouteController,
    UsersRouteController
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

        routes.push(new PlacesRouteController());
        routes.push(new UsersRouteController());

        return Promise.resolve(routes);
    }

}