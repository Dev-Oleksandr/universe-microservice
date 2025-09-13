export type Row = Record<string, any>;

export type OrderItem = {
  column: string;
  direction?: 'ASC' | 'DESC';
  nulls?: 'FIRST' | 'LAST';
};
