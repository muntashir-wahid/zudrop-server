export type PaginationMetaInput = {
  page: number;
  limit: number;
  total: number;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export const formatPaginationMeta = ({
  page,
  limit,
  total,
}: PaginationMetaInput): PaginationMeta => {
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: total > 0 && page < totalPages,
    hasPrev: page > 1,
  };
};
