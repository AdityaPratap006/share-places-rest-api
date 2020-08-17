import express, { Express } from 'express';
import { InitializeMiddleware } from './InitializeMiddleware';
import { InitializeRoutes } from './InitializeRoutes';
import { InitializeDB } from './InitializeDB';

export async function runServer() {
    const app: Express = express();
    const PORT = process.env.PORT || 5000;

    try {
        await InitializeMiddleware.InitializeCommonMiddleware(app);

        await InitializeRoutes.Initialze(app);

        await InitializeMiddleware.InitializeErrorHandlingMiddleware(app);

        await InitializeDB.Initialize();

        app.listen(PORT, () => {
            console.log(`Server is listening on PORT: ${PORT}`);
        });

    } catch (error) {
        console.log({ error });
    }
}