import { Test } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';

describe('ProductsService', () => {
  it('create a product', async () => {
    const productName = 'test-name';

    const repoMock = {
      create: jest.fn().mockResolvedValue({
        id: 1,
        name: productName,
        created_at: new Date().toISOString(),
      } as never),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: ProductsRepository, useValue: repoMock },
      ],
    }).compile();

    const productsService = moduleRef.get(ProductsService);

    expect((productsService as any).productsRepository).toBeDefined();

    const result = await productsService.createProduct({ name: productName });

    expect(repoMock.create).toHaveBeenCalledWith(
      { name: productName },
      { returning: '*' },
    );
    expect(result).toEqual({
      id: expect.any(Number) as number,
      name: productName,
      created_at: expect.any(String) as string,
    });
  });
});
