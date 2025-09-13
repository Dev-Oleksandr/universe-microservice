import { Inject, Injectable } from '@nestjs/common';
import { DatabaseMapper } from '../database/database.mapper.js';
import { Row } from '../database/types.js';
import { PG_POOL } from '../database/database.module.js';
import { Pool } from 'pg';

@Injectable()
export class ProductsRepository {
  constructor(
    @Inject(PG_POOL) private readonly pool: Pool,
    private readonly databaseMapper: DatabaseMapper,
  ) {}

  async create(
    data: Row | Row[],
    opts?: { schema?: string; returning?: '*' | string[] },
  ) {
    const { query, values } = this.databaseMapper.insert(
      'products',
      data,
      opts,
    );
    const requestResult = await this.pool.query(query, values);

    return requestResult.rows;
  }

  async paginatedFindAndCountAll(pagination: {
    limit?: number;
    offset?: number;
  }) {
    const { query: selectSql, values } =
      this.databaseMapper.buildSelectAllPaginated('products', pagination);

    const { query: totalRowsQuery } =
      this.databaseMapper.buildCountAll('products');
    const [resultProducts, resultTotal] = await Promise.all([
      this.pool.query(selectSql, values),
      this.pool.query(totalRowsQuery),
    ]);

    return {
      rows: resultProducts.rows,
      total: Number(resultTotal.rows.at(0)?.total) ?? 0,
    };
  }
}
