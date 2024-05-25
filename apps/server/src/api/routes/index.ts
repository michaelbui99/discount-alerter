import { Router } from 'express';
import { configRouter } from './config';

const router = Router();
router.use('/config', configRouter);

export const appRouter = router;
