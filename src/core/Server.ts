import express, { Express } from 'express';
import { InitializeMiddleware } from './InitializeMiddleware';
import { InitializeRoutes } from './InitializeRoutes';

export async function runServer() {
    const app: Express = express();
    const PORT = process.env.PORT || 4000;

    await InitializeMiddleware.InitializeCommonMiddleware(app);

    await InitializeRoutes.Initialze(app);

    await InitializeMiddleware.InitializeErrorHandlingMiddleware(app);

    app.listen(PORT, () => {
        console.log(`Server is listening on PORT: ${PORT}`);
    });
}