import { Body, Controller, Post } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './schemas/create-product.dto.js';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }
}
