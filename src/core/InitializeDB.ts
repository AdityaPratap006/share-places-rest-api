import mongoose from 'mongoose';
import { config } from 'dotenv';
import { resolve } from 'path';
import { urlencoded } from 'body-parser';

config({
    path: resolve(__dirname, "../../.env"),
});

export class InitializeDB {

    public static async Initialize() {
        const password = process.env['MONGO_PASSWORD']!;
        const username = process.env['MONGO_USERNAME']!;
        const dbName = process.env['DB_NAME']!;

        const dbURI = `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@cluster0.rr0fx.mongodb.net/${encodeURIComponent(dbName)}?retryWrites=true&w=majority`;

        return mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
    }
}