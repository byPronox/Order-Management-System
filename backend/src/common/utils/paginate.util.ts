import { SelectQueryBuilder } from 'typeorm';
import { PaginatedResult } from '../interfaces/paginated-result.interface';

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

export async function paginate<T>(
  qb: SelectQueryBuilder<T>,
  page?: number,
  limit?: number,
): Promise<T[] | PaginatedResult<T>> {
  if (!page && !limit) {
    return qb.getMany();
  }

  const currentPage = page && page > 0 ? page : 1;
  const pageSize = limit && limit > 0 ? Math.min(limit, MAX_LIMIT) : DEFAULT_LIMIT;

  const [data, total] = await qb
    .skip((currentPage - 1) * pageSize)
    .take(pageSize)
    .getManyAndCount();

  return {
    data,
    meta: {
      total,
      page: currentPage,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}