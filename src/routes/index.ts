import { Router } from 'express';
import dropsRouter from '../modules/drops/drops.routes';
import purchasesRouter from '../modules/purchases/purchases.routes';

const router = Router();

router.use('/drops', dropsRouter);
router.use('/purchases', purchasesRouter);

export default router;
