import { Express } from 'express'
import { Response, Request } from 'express'
import { StatusConstants } from '../constants/StatusConstants'

export class ErrorHandlingMiddleware {

    app: Express

    constructor(_app: Express) {
        this.app = _app
    }

    public async handle404Error() {
        this.app.use((req: Request, res: Response) => {
            res.status(StatusConstants.CODE_404).send(StatusConstants.CODE_404_MESSAGE);
        })
    }

    public async handle500Error() {
        this.app.use((req: Request, res: Response) => {
            res.status(StatusConstants.CODE_500).send(StatusConstants.CODE_500_MESSAGE);
        });
    }

}