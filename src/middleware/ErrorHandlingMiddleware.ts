import { Express, ErrorRequestHandler, NextFunction } from 'express'
import { Response, Request } from 'express'
import { StatusConstants } from '../constants/StatusConstants'
import { ServiceError } from '../utils/errors/ServiceError';

export class ErrorHandlingMiddleware {

    app: Express

    constructor(_app: Express) {
        this.app = _app
    }

    public async handle404Error() {
        this.app.use((req: Request, res: Response) => {
            res.status(StatusConstants.CODE_404).send({
                message: StatusConstants.CODE_404_MESSAGE,
            });
        })
    }

    public async handle500Error() {
        this.app.use((req: Request, res: Response) => {
            res.status(StatusConstants.CODE_500).send({
                message: StatusConstants.CODE_500_MESSAGE,
            });
        });
    }

    public async handleError() {

        const errorHandler: ErrorRequestHandler = (
            error: ServiceError,
            req: Request,
            res: Response,
            next: NextFunction
        ) => {

            if (res.headersSent) {
                next(error);
                return;
            }

            res.status(error.code || StatusConstants.CODE_500).json({
                message: error.message || StatusConstants.CODE_500_MESSAGE,
            });
        }

        this.app.use(errorHandler);
    }

}