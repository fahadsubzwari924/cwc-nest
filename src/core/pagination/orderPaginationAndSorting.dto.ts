import { Transform } from 'class-transformer';
import { IsInt, IsIn, IsOptional } from 'class-validator';
import { TransformStringToInt } from '../../utils/decorators/stringToInt.decorator';

export class OrderPaginationAndSortingDTO {
  @Transform((value) => TransformStringToInt(value))
  @IsInt()
  @IsOptional()
  page = 1; // Default value for 'page' is 1

  @Transform((value) => TransformStringToInt(value))
  @IsInt()
  @IsOptional()
  pageSize = 10; // Default value for 'pageSize' is 10

  @IsOptional()
  sortBy = 'orderDate'; // Default sorting column

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'desc'; // Default sorting order
}
