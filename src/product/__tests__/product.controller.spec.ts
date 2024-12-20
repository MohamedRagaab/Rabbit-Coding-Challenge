import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../product.controller';
import { ProductService } from '../product.service';
import { GetAllProductsDTO } from '../dto/get-all-products.dto';
import { ProductDTO } from '../dto/product.dto';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getAllProducts: jest.fn(),
            getTopOrderedProducts: jest.fn(),
            getProductById: jest.fn(),
          },
        },
      ],
    }).compile();

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return an array of products', async () => {
      const result: ProductDTO[] = [{ id: 1, name: 'Product 1', category: 'Category 1', area: 'Zayed', createdAt: new Date() }];
      jest.spyOn(productService, 'getAllProducts').mockResolvedValue(result);

      expect(await productController.getAllProducts(new GetAllProductsDTO()))
        .toBe(result);
    });
  });

  describe('getTopOrderedProducts', () => {
    it('should return top ordered products', async () => {
      const area = 'US';
      const result: ProductDTO[] = [{ id: 1, name: 'Product 1', category: 'Category 1', area: 'Zayed', createdAt: new Date() }];
      jest.spyOn(productService, 'getTopOrderedProducts').mockResolvedValue(result);

      expect(await productController.getTopOrderedProducts(area)).toBe(result);
    });
  });
});
