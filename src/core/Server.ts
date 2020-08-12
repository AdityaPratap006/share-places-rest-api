import express, { Express, Request, Response } from 'express';
import { InitializeMiddleware } from './InitializeMiddleware';

export async function runServer() {
    const app: Express = express();
    const PORT = process.env.PORT || 4000;

    await InitializeMiddleware.InitializeCommonMiddleware(app);
    // --initialize routes here--
    app.get('/', (req: Request, res: Response) => {
        res.send({
            message: 'Hi there!',
        });
    });

    await InitializeMiddleware.InitializeErrorHandlingMiddleware(app);

    app.listen(PORT, () => {
        console.log(`Server is listening on PORT: ${PORT}`);
    });
}