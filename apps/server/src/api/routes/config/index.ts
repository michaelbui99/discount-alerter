import { Router } from 'express';
import { ApiResponse } from '../../..//api/dtos/api-response';
import { Request, Response } from '../../../api/typedefs';
import { ConfigLoader } from '../../../config/config-loader';

const router = Router();
const loader = new ConfigLoader();
const configPromise = loader.load();

router.get('/', async (req: Request, res: Response) => {
    const config = await configPromise;
    if (!config) {
        res.json(
            ApiResponse.InternalServerError({
                title: 'GET Application Configuration - No Application Configuration Loaded',
                error: 'no application configuration has been loaded',
            }),
        );
    }

    res.json(
        ApiResponse.Ok({
            title: 'GET Application Configuration - OK',
            data: config,
        }),
    );
});

export const configRouter = router;
