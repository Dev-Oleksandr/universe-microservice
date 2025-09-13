import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './schemas/create-product.dto.js';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
} from '../database/constants.js';
import { DataListResponseMapper } from '../common/data-list-response.mapper.js';
import { MetricsService } from '../metrics/metrics.service.js';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly metricsService: MetricsService,
  ) {}

  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    this.metricsService.increment({ action: 'create', entity: 'products' });
    return this.productsService.createProduct(dto);
  }

  @Get()
  async findPaginatedProducts(
    @Query('limit', new ParseIntPipe({ optional: true }))
    limit = DEFAULT_PAGINATION_LIMIT,
    @Query('offset', new ParseIntPipe({ optional: true }))
    offset = DEFAULT_PAGINATION_OFFSET,
  ) {
    const { rows, total } = await this.productsService.findPaginatedProducts({
      limit,
      offset,
    });

    return new DataListResponseMapper(limit, offset).toResult(rows, total);
  }

  @Delete(':productId')
  async deleteProduct(@Param('productId', ParseIntPipe) productId: number) {
    this.metricsService.increment({ action: 'delete', entity: 'products' });
    await this.productsService.deleteProduct(productId);

    return { message: 'ok' };
  }
}
