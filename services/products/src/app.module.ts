import { Module } from '@nestjs/common';
import { DbModule } from './database/database.module.js';
import { ProductsModule } from './products/products.module.js';

@Module({
  imports: [ProductsModule, DbModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
