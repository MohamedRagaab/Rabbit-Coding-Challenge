import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../order.controller';
import { OrderService } from '../order.service';
import { CreateOrderDTO } from '../dto/create-order-dto';
import { OrderDTO } from '../dto/order.dto';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    orderController = module.get<OrderController>(OrderController);
    orderService = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(orderController).toBeDefined();
  });

  describe('create', () => {
    it('should create an order and return order data', async () => {
      const createOrderDTO: CreateOrderDTO = {
        customerId: 1,
        products: [{ productId: 1, quantity: 2 }],
      };
      const result: OrderDTO = { id: 1, customerId: 1, createdAt: new Date() };
      jest.spyOn(orderService, 'create').mockResolvedValue(result);

      expect(await orderController.create(createOrderDTO)).toBe(result);
    });
  });
});
