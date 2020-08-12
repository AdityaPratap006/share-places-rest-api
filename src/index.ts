import express, { Request, Response } from 'express';

const app = express();

const PORT = process.env.PORT || 4000;

app.get('/', (req: Request, res: Response) => {
    res.send({
        message: 'Hi there!',
    });
});

app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
});