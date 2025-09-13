import { Injectable } from '@nestjs/common';
import { Row } from './types.js';

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
}
