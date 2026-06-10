import { client } from '../../prisma/client';
import { emitStockEvent } from '../../config/socket';
import { CreateDropBody } from './drops.validation';

export const createDrop = async (body: CreateDropBody) => {
  const { name, description, price, availableStock } = body;

  const newDrop = await client.drop.create({ data: { name, description, price, availableStock } });
  emitStockEvent({
    action: 'created',
    drop: newDrop,
  });

  return newDrop;
};

export const getDrops = async () => {
  const drops = await client.drop.findMany({
    where: { isActive: true },
    include: {
      purchases: {
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: {
          user: {
            select: { username: true },
          },
        },
      },
    },

    orderBy: { createdAt: 'desc' },
  });

  const formattedDrops = drops.map((drop) => ({
    ...drop,
    purchases: drop.purchases.map((purchase) => ({
      username: purchase.user.username,
      purchasedAt: purchase.createdAt,
    })),
  }));

  return formattedDrops;
};
