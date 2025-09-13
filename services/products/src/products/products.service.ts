import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './schemas/create-product.dto.js';
import { ProductsRepository } from './products.repository.js';

@Injectable()
export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}
  createProduct(dto: CreateProductDto) {
    return this.productsRepository.create(dto, { returning: '*' });
  }

  findPaginatedProducts(pagination: { limit?: number; offset?: number }) {
    return this.productsRepository.paginatedFindAndCountAll(pagination);
  }

  deleteProduct(productId: number) {
    return this.productsRepository.deleteOne(productId);
  }
}
