import { Router } from 'express';
import { StorageController } from '../../../api/controllers';

export function initStorageRouter(): Router {
    const controller = new StorageController();
    const router = Router();

    router.get('/', controller.get());
    router.get('/resolved', controller.getResolved());

    return router;
}
