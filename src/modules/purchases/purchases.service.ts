import { CreatePurchaseBody } from './purchases.validation';

export const createPurchase = async (body: CreatePurchaseBody) => {
  const { dropId, username } = body;

  return body;
};
