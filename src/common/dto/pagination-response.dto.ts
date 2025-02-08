import { ApiProperty } from '@nestjs/swagger';
import {
  IPaginationMeta,
  IPaginationResponse,
} from '@common/interfaces/pagination.interface';

export class PaginationResponseDto<T> implements IPaginationResponse<T> {
  @ApiProperty({ isArray: true })
  data: T[];

  @ApiProperty()
  meta: IPaginationMeta;

  constructor(items: T[], meta: IPaginationMeta) {
    this.data = items;
    this.meta = meta;
  }
}
