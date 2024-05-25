import {
    ApplicationConfiguration,
    ILogger,
    Logger,
} from '@michaelbui99-discount-alerter/models';
import { Response, Request } from '../typedefs';
import { ApiResponse } from '../dtos/api-response';
import { ConfigLoader } from '../../config/config-loader';

export class ConfigController {
    private config: ApplicationConfiguration;
    private loader: ConfigLoader;
    private logger: ILogger;

    constructor() {
        this.loader = new ConfigLoader();
        this.logger = Logger.for('API');
    }

    public get() {
        return async (req: Request, res: Response) => {
            await this.ensureConfigLoaded();
            if (!this.config) {
                this.logger.info(`return 500 - no application configuration`);
                res.json(
                    ApiResponse.InternalServerError({
                        title: 'GET Application Configuration - No Application Configuration Loaded',
                        error: 'no application configuration has been loaded',
                    }),
                );
            }

            this.logger.info(`return 200`);
            res.json(
                ApiResponse.Ok({
                    title: 'GET Application Configuration - OK',
                    data: this.config,
                }),
            );
        };
    }

    private async ensureConfigLoaded(): Promise<void> {
        if (!this.config) {
            this.config = await this.loader.load();
        }
    }
}
