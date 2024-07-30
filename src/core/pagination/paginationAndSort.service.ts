import { Repository, FindManyOptions, FindOptionsOrder, ILike } from 'typeorm';
import { PaginationAndSortingDTO } from './paginationAndSorting.dto';
import { IPaginationResponseMeta } from './pagination-response-metadata.interface';

export async function paginateAndSort<Entity>(
  repository: Repository<Entity>,
  dto: PaginationAndSortingDTO,
  relations = null,
): Promise<{ data: Entity[]; metadata: IPaginationResponseMeta }> {
  const { page, pageSize, sortBy, sortOrder } = dto;

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const findOptions: FindManyOptions<Entity> = {
    skip,
    take,
    order: { [sortBy]: sortOrder } as FindOptionsOrder<Entity>,
  };

  if (relations) {
    findOptions.relations = relations;
  }

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

export async function paginateAndSortWithQueryParams<Entity>(
  repository: Repository<Entity>,
  dto: PaginationAndSortingDTO,
  relations = null,
): Promise<{ data: Entity[]; metadata: IPaginationResponseMeta }> {
  const { page, pageSize, sortBy, sortOrder, filters } = dto;

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const queryBuilder = repository.createQueryBuilder('entity');

  if (relations) {
    Object.keys(relations).forEach((relation) => {
      if (relations[relation]) {
        queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
      }
    });
  }

  if (filters) {
    const parsedFilters = JSON.parse(filters);
    Object.keys(parsedFilters).forEach((key) => {
      queryBuilder.andWhere(`entity.${key} = :${key}`, {
        [key]: parsedFilters[key],
      });
    });
  }

  queryBuilder.skip(skip).take(take).orderBy(`entity.${sortBy}`, sortOrder);

  const [records, totalItems] = await queryBuilder.getManyAndCount();

  const paginationMeta: IPaginationResponseMeta = {
    totalItems,
    page,
    pageSize,
    sortBy,
    sortOrder,
  };

  return { data: records, metadata: paginationMeta };
}
