import { client } from '../../prisma/client';
import { CreateDropBody } from './drops.validation';

export const createDrop = async (body: CreateDropBody) => {
  const { name, description, price, availableStock } = body;

  const newDrop = await client.drop.create({ data: { name, description, price, availableStock } });

  return newDrop;
};

export const getDrops = async () => {
  const drops = await client.drop.findMany();

  return drops;
};
