import { Repository, FindManyOptions, FindOptionsOrder } from 'typeorm';
import { PaginationAndSortingDTO } from './paginationAndSorting.dto';
import { IPaginationResponseMeta } from './pagination-response-metadata.interface';

export async function paginateAndSort<Entity>(
  repository: Repository<Entity>,
  dto: PaginationAndSortingDTO,
): Promise<{ data: Entity[]; metadata: IPaginationResponseMeta }> {
  const { page, pageSize, sortBy, sortOrder } = dto;

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const findOptions: FindManyOptions<Entity> = {
    skip,
    take,
    order: { [sortBy]: sortOrder } as FindOptionsOrder<Entity>,
  };

  const [records, totalItems] = await repository.findAndCount(findOptions);

  const paginationMeta: IPaginationResponseMeta = {
    totalItems,
    page,
    pageSize,
    sortBy,
    sortOrder,
  };

  return { data: records, metadata: paginationMeta };
}
