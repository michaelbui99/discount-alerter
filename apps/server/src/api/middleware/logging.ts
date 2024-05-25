import { Request, Response } from '../typedefs';
import { NextFunction } from 'express';
import { Logger } from '@michaelbui99-discount-alerter/models';

export function logging() {
    return (req: Request, res: Response, next: NextFunction) => {
        const logger = Logger.for('API');
        logger.info(`${req.method} - ${req.originalUrl}`);
        next();
    };
}
