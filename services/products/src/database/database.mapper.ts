import { Injectable } from '@nestjs/common';
import { OrderItem, Row } from './types.js';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
  MAX_PAGINATION_LIMIT,
  MIN_PAGINATION_LIMIT,
  MIN_PAGINATION_OFFSET,
} from './constants.js';

@Injectable()
export class DatabaseMapper {
  insert(
    table: string,
    rowsInput: Row | Row[],
    opts?: { schema?: string; returning?: '*' | string[] },
  ): { query: string; values: any[]; columns: string[] } {
    const rows = (
      Array.isArray(rowsInput) ? rowsInput : [rowsInput]
    ) as Array<Row>;

    const columns = this.unionColumns(rows);

    let sqlParam = 1;
    const values: unknown[] = [];
    const tuples = rows.map((r) => {
      const placeholders = columns.map((column) => {
        const value = r[column] as string | undefined;
        values.push(value === undefined ? null : value);
        return `$${sqlParam++}`;
      });
      return `(${placeholders.join(',')})`;
    });

    const columnsSql = columns.map((item) => this.sanitizeText(item)).join(',');
    const tableSQL = this.tableSQL(table, opts?.schema);
    const shouldReturnAllColumns = opts?.returning === '*';
    let returnString = '';
    if (shouldReturnAllColumns) {
      returnString = ' RETURNING *';
    } else if (Array.isArray(opts?.returning) && opts.returning.length) {
      returnString = ` RETURNING ${opts.returning.map((item) => this.sanitizeText(item)).join(',')}`;
    }

    const query = `INSERT INTO ${tableSQL} (${columnsSql}) VALUES ${tuples.join(',')}${returnString};`;
    return { query, values, columns };
  }

  buildSelectAllPaginated(
    table: string,
    opts: {
      schema?: string;
      limit?: number;
      offset?: number;
      orderBy?: OrderItem[];
    } = {},
  ): { query: string; values: any[] } {
    const tableSQL = this.tableSQL(table, opts.schema);

    const limit = this.getValidatedLimit(opts.limit);
    const offset = this.getValidatedOffset(opts.offset);

    let orderSQL = '';
    if (opts.orderBy?.length) {
      const parts = opts.orderBy.map((order) => {
        const direction = order.direction ?? 'ASC';
        const nulls = order.nulls ? ` NULLS ${order.nulls}` : '';
        return `${this.sanitizeText(order.column)} ${direction}${nulls}`;
      });
      orderSQL = ` ORDER BY ${parts.join(', ')}`;
    }

    const query = `SELECT * FROM ${tableSQL}${orderSQL} LIMIT ${limit} OFFSET ${offset};`;
    return { query, values: [] };
  }

  buildCountAll(table: string, schema?: string) {
    const tableSQL = this.tableSQL(table, schema);
    return { query: `SELECT COUNT(*) AS total FROM ${tableSQL};` };
  }

  private unionColumns(rows: Row[]): string[] {
    const seen = new Set<string>();
    const columns: string[] = [];
    for (const r of rows) {
      for (const k of Object.keys(r)) {
        if (!seen.has(k)) {
          seen.add(k);
          columns.push(k);
        }
      }
    }
    return columns;
  }

  private sanitizeText(text: string): string {
    return text.replace(/([%\\_])/g, '\\$1');
  }

  private tableSQL(table: string, schema?: string) {
    return schema
      ? `${this.sanitizeText(schema)}.${this.sanitizeText(table)}`
      : this.sanitizeText(table);
  }

  private getValidatedLimit(limit?: number): number {
    if (!limit) return DEFAULT_PAGINATION_LIMIT;

    if (limit <= MIN_PAGINATION_LIMIT) return MIN_PAGINATION_LIMIT;
    if (limit > MAX_PAGINATION_LIMIT) return MAX_PAGINATION_LIMIT;

    return limit;
  }

  private getValidatedOffset(offset?: number): number {
    if (!offset) return DEFAULT_PAGINATION_OFFSET;
    if (offset <= MIN_PAGINATION_OFFSET) return MIN_PAGINATION_OFFSET;

    return offset;
  }
}
