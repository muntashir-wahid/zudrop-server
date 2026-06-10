import { Router } from 'express';

import { createDrop, getDrops } from './drops.controller';

const router = Router();

router.route('/').post(createDrop).get(getDrops);

export default router;
