import { Request, Response } from 'express';
import { successResponse } from '../../utils/apiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

import * as purchasesService from './purchases.service';

export const createPurchase = asyncHandler(async (req: Request, res: Response) => {
  const data = await purchasesService.createPurchase(req.body);
  successResponse(res, data, 201);
});
