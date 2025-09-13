import {
  Body,
  Controller,
  Get,
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

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @Get()
  findPaginatedProducts(
    @Query('limit', new ParseIntPipe({ optional: true }))
    limit = DEFAULT_PAGINATION_LIMIT,
    @Query('offset', new ParseIntPipe({ optional: true }))
    offset = DEFAULT_PAGINATION_OFFSET,
  ) {
    return this.productsService.findPaginatedProducts({ limit, offset });
  }
}
