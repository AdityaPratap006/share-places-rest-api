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

        // Add places controller after users controller 
        // as some places routes use authentication middleware
        // and we don't want users routes to use it.
        routes.push(new UsersRouteController());
        routes.push(new PlacesRouteController());

        return Promise.resolve(routes);
    }

}