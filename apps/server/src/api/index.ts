import express from 'express';
import cors from 'cors';
import { EnvironmentVariableReader } from '../env-reader/environment-variable-reader';
import { Response, Request } from './typedefs';
import { logging } from './middleware/logging';
import {
    ApplicationConfiguration,
    Logger,
} from '@michaelbui99-discount-alerter/models';
import { initAppRouter } from './routes';
import { ProviderController } from './controllers/provider';
import { ProviderManager } from '@michaelbui99-discount-alerter/provider';

export const startApiServer = async (
    config: ApplicationConfiguration,
    providerManager: ProviderManager,
) => {
    const envReader = new EnvironmentVariableReader();
    const app = express();

    const logger = Logger.for('API');
    const port = envReader.readOrElseGet({
        variableName: 'DA_PORT',
        orElse: () => `${config.server.port}` ?? '8080',
    });

    ProviderController.$inject({ providerManager });

    // Middlewares
    app.use(cors());
    app.use(express.json());
    app.use(logging());

    // Routes
    app.use('/api/v1', initAppRouter());

    // Root response
    app.get('/', (req: Request, res: Response) => {
        res.json({ apiVersions: [{ version: 'v1', root: '/api/v1' }] });
    });

    app.listen(port, () => {
        logger.info(`API is now listening on port ${port} 🚀`);
    }).on('error', (err) => {
        logger.error(`Failed to start API: ${err}`);
    });
};
