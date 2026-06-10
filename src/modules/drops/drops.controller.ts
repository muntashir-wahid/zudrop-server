import { successResponse } from '../../utils/apiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

import * as dropsService from './drops.service';

export const createDrop = asyncHandler(async (req: Request, res: Response) => {
  const data = await dropsService.createDrop(req.body);
  successResponse(res, data, 201);
});

export const getDrops = asyncHandler(async (req: Request, res: Response) => {
  const data = await dropsService.getDrops();
  successResponse(res, data);
});
