import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { ProductsModule } from './products/products.module.js';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from '@anatine/zod-nestjs';
import { MetricsModule } from './metrics/metrics.module.js';

@Module({
  imports: [ProductsModule, DatabaseModule, MetricsModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
