import { Global, Module } from '@nestjs/common';
import { Pool } from 'pg';
import { DatabaseMapper } from './database.mapper.js';

export const PG_POOL = Symbol('PG_POOL');

@Global()
@Module({
  providers: [
    DatabaseMapper,
    {
      provide: PG_POOL,
      useFactory: () => {
        return new Pool({
          connectionString: process.env.DATABASE_URL,
        });
      },
    },
  ],
  exports: [PG_POOL, DatabaseMapper],
})
export class DatabaseModule {}
