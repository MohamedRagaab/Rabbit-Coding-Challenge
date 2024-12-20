import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../order.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDTO } from '../dto/create-order-dto';
import { OrderDTO } from '../dto/order.dto';

describe('OrderService', () => {
  let orderService: OrderService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        PrismaService,
      ],
    }).compile();

    orderService = module.get<OrderService>(OrderService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(orderService).toBeDefined();
  });

  describe('create', () => {
    it('should create an order and return order details', async () => {
      const createOrderDTO: CreateOrderDTO = {
        customerId: 1,
        products: [{ productId: 1, quantity: 2 }],
      };
      const result: OrderDTO = { id: 1, customerId: 1, createdAt: new Date() };

      jest.spyOn(prismaService.order, 'create').mockResolvedValue({
        id: 1,
        customerId: 1,
        createdAt: new Date(),
      });
      jest.spyOn(prismaService.orderItem, 'createMany').mockResolvedValue({ count: 1 });

      expect((await orderService.create(createOrderDTO)).customerId).toEqual(result.customerId);
    });
  });

  describe('checkProductsAvailability', () => {
    it('should return true if all products are available', async () => {
      const productIds = [1, 2];
      const availableProducts = [
        { id: 1, name: "Product 1", category: "Category 1", area: "Zayed", createdAt: new Date() },
        { id: 2, name: "Product 2", category: "Category 2", area: "New Cairo", createdAt: new Date() }
      ];
      jest.spyOn(prismaService.product, 'findMany').mockResolvedValue(availableProducts);

      expect(await orderService.checkProductsAvailability(productIds)).toBe(true);
    });

    it('should return false if some products are not available', async () => {
      const productIds = [1, 2];
      const availableProducts = [
        { id: 1, name: "Product 1", category: "Category 1", area: "Zayed", createdAt: new Date() }
      ];
      jest.spyOn(prismaService.product, 'findMany').mockResolvedValue(availableProducts);

      expect(await orderService.checkProductsAvailability(productIds)).toBe(false);
    });
  });
});
