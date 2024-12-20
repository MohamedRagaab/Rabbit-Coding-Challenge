import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; 
import { CreateOrderDTO } from './dto/create-order-dto';
import { sendNotification } from 'src/pushover/pushoverClient';
import { OrderDTO } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async create(orderData: CreateOrderDTO): Promise<OrderDTO> {
    return this.prisma.$transaction(async (transaction) => {
      const uniqueProductIds = [...new Set(orderData.products.map(p => p.productId))];
      const isAvailable = await this.checkProductsAvailability(uniqueProductIds);

      if (!isAvailable) {
        throw new NotFoundException('Some products are not available');
      }

      // Create order
      const createOrderData = {
        customerId: orderData.customerId
      };

      const order = await transaction.order.create({
        data: createOrderData,
      });

      // Create order items
      const orderItemsData = orderData.products.map(product => ({
        orderId: order.id,
        productId: product.productId,
        quantity: product.quantity,
      }));

      await transaction.orderItem.createMany({
        data: orderItemsData,
      });

      // Send notification
      await sendNotification({
        title: 'New Order Created',
        message: `Order ID: ${order.id} has been successfully created.`,
      });

      return {
        id: order.id,
        customerId: order.customerId,
        createdAt: order.createdAt,
      } as OrderDTO;
    });
  }

  async checkProductsAvailability(productIds: number[]): Promise<boolean> {
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    return products.length === productIds.length;
  }
}
