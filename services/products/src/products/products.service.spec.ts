import { Test } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let repoMock: any;

  beforeEach(async () => {
    repoMock = {
      create: jest.fn(),
      deleteOne: jest.fn(),
      paginatedFindAndCountAll: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: ProductsRepository, useValue: repoMock },
      ],
    }).compile();

    productsService = moduleRef.get(ProductsService);
  });

  it('create a product', async () => {
    const productName = 'test-name';
    repoMock.create.mockResolvedValue({
      id: 1,
      name: productName,
      created_at: new Date().toISOString(),
    });

    const result = await productsService.createProduct({ name: productName });

    expect(repoMock.create).toHaveBeenCalledWith(
      { name: productName },
      { returning: '*' },
    );
    expect(result).toEqual({
      id: expect.any(Number),
      name: productName,
      created_at: expect.any(String),
    });
  });

  it('delete a product', async () => {
    repoMock.deleteOne.mockResolvedValue({ message: 'ok' });

    const id = 123;
    const result = await productsService.deleteProduct(id);

    expect(repoMock.deleteOne).toHaveBeenCalledWith(id);
    expect(result).toEqual({ message: 'ok' });
  });

  it('list products (paginated)', async () => {
    const limit = 2;
    const offset = 0;
    const data = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
    ];
    repoMock.paginatedFindAndCountAll.mockResolvedValue({
      total: data.length,
      data,
    });

    const result = await productsService.findPaginatedProducts({
      limit,
      offset,
    });

    expect(repoMock.paginatedFindAndCountAll).toHaveBeenCalledWith({
      limit,
      offset,
    });
    expect(result).toEqual({
      total: data.length,
      data: data.map(({ id, name }) => ({
        id,
        name,
      })),
    });
  });
});
