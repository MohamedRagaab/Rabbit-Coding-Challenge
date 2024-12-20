import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../../product/product.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductRepository } from '../product.repository';
import { redisClient } from '../../redis/redisClient';
import { ProductDTO } from '../dto/product.dto';
import { GetAllProductsDTO } from '../dto/get-all-products.dto';
import { TOP_FREQUENTLY_ORDERED_PRODUCTS_TTL } from '../utils/constants';

jest.mock('src/redis/redisClient');

describe('ProductService', () => {
  let productService: ProductService;
  let prismaService: PrismaService;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        PrismaService,
        ProductRepository,
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    prismaService = module.get<PrismaService>(PrismaService);
    productRepository = module.get<ProductRepository>(ProductRepository);
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return an array of products', async () => {
      const filters: GetAllProductsDTO = { limit: 10, offset: 0 };
      const result: ProductDTO[] = [{ id: 1, name: 'Product 1', category: 'Category 1', area: 'Zayed', createdAt: new Date() }];
      jest.spyOn(prismaService.product, 'findMany').mockResolvedValue(result);

      expect(await productService.getAllProducts(filters)).toBe(result);
    });
  });

  describe('getTopOrderedProducts', () => {
    it('should return cached data if available', async () => {
      const area = 'US';
      const cachedData = JSON.stringify([{ id: 1, name: 'Product 1', price: 100 }]);
      jest.spyOn(redisClient, 'get').mockResolvedValue(cachedData);

      const result = await productService.getTopOrderedProducts(area);
      expect(result).toEqual(JSON.parse(cachedData));
    });

    it('should fetch and cache top ordered products if not cached', async () => {
      const area = 'US';
      const result: ProductDTO[] = [{ id: 1, name: 'Product 1', category: 'Category 1', area: 'Zayed', createdAt: new Date() }];
      const cacheKey = `top_products:${area}`;
      jest.spyOn(redisClient, 'get').mockResolvedValue(null);
      jest.spyOn(redisClient, 'set').mockResolvedValue('OK');
      jest.spyOn(prismaService, '$queryRaw').mockResolvedValue(result);

      expect(await productService.getTopOrderedProducts(area)).toBe(result);
      expect(redisClient.set).toHaveBeenCalledWith(cacheKey, JSON.stringify(result), { EX: TOP_FREQUENTLY_ORDERED_PRODUCTS_TTL });
    });
  });
});
