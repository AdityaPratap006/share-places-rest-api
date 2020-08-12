import winston from 'winston';
import loggerConfig from '../../../configs/LoggerConfig.json';

export class Logger {
    private logger: winston.Logger;

    private static instance: Logger;
    private constructor() {
        this.logger = winston.createLogger({
            transports: [
                new winston.transports.Console(loggerConfig.options.console),
                new winston.transports.File(loggerConfig.options.file)
            ]
        });
    }

    public static getLoggerInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }

        return Logger.instance;
    }

    public static getLogger() {
        let _logger = Logger.getLoggerInstance();
        return _logger.logger;
    }
}