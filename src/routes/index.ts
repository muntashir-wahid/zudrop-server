import { Router } from 'express';
import dropsRouter from '../modules/drops/drops.routes';

const router = Router();

router.use('/drops', dropsRouter);

export default router;
