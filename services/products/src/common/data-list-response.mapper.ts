export interface IDataListResponse<T> {
  limit: number;
  offset: number;
  total: number;
  data: T[];
}

export class DataListResponseMapper {
  constructor(
    public readonly limit: number,
    public readonly offset: number,
  ) {}

  toResult<T>(data: T[], total: number): IDataListResponse<T> {
    return {
      total,
      data,
      limit: this.limit,
      offset: this.offset,
    };
  }
}
