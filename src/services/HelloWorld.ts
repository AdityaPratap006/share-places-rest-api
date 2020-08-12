export class HelloWorld {
    public static async wishHello(): Promise<string> {
        const response = `Hello World!`;
        return Promise.resolve(response);
    }
}