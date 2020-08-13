import { Express } from 'express';
import { CommonMiddleware, ErrorHandlingMiddleware } from '../middleware';

export class InitializeMiddleware {

    public static async InitializeCommonMiddleware(app: Express) {
        const middleware = new CommonMiddleware(app);

        await middleware.useBodyParser();
        await middleware.useURLencoded();
        await middleware.useCors();
    }

    public static async InitializeErrorHandlingMiddleware(app: Express) {
        const errorMiddleware = new ErrorHandlingMiddleware(app);

        await errorMiddleware.handle404Error();
        await errorMiddleware.handle500Error();
        await errorMiddleware.handleError();
    }
}