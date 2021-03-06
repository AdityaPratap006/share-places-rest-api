import express, { Express, Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger/Logger';
import cors from 'cors';

export class CommonMiddleware {
    app: Express;

    constructor(_app: Express) {
        this.app = _app;
    }

    public async useBodyParser() {
        this.app.use(express.json({
            limit: '10mb',
        }));
    }

    public async useURLencoded() {
        this.app.use(
            express.urlencoded({
                extended: true,
            })
        );
    }

    public async useCors() {
        this.app.use(cors());
    }

    public async logRequests() {
        let logger = Logger.getLogger();
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            logger.info(req.originalUrl);
            next();
        });
    }
}