import express, { Request, Response, Router } from 'express';

export abstract class AbstractRouteController {

    router = Router();
    path!: string;

    public async InitializeController() {
        console.log(this.path);
        await this.InitializeGet();
        await this.InitializeGet();
    }

    public async runService(req: Request, res: Response): Promise<any> {
        res.send(`runService Method for ${this.path} doesn't exist!`);
    }

    public async InitializeGet() {
        this.router.get(this.path, this.runService.bind(this)).bind(this);
    }

    public async InitializePost() {
        this.router.post(this.path, this.runService.bind(this)).bind(this);
    }
}
