import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './schemas/create-product.dto.js';
import { ProductsRepository } from './products.repository.js';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}
  createProduct(dto: CreateProductDto) {
    return this.productsRepository.create(dto, { returning: '*' });
  }
}
