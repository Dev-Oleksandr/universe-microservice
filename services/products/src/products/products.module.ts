import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';
import { ProductsRepository } from './products.repository.js';
import { DatabaseModule } from '../database/database.module.js';
import { MetricsModule } from '../metrics/metrics.module.js';

@Module({
  imports: [DatabaseModule, MetricsModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
