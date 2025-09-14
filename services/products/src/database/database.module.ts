import { Global, Module } from '@nestjs/common';
import { Pool } from 'pg';
import { DatabaseMapper } from './database.mapper.js';
import * as process from 'node:process';

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
          password: process.env.POSTGRES_PASSWORD,
        });
      },
    },
  ],
  exports: [PG_POOL, DatabaseMapper],
})
export class DatabaseModule {}
