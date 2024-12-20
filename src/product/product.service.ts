import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAllProductsDTO } from './dto/get-all-products.dto';
import { ProductDTO } from './dto/product.dto';
import { DEFAULT_PRODUCTS_LISTING_CONSTANTS, TOP_FREQUENTLY_ORDERED_PRODUCTS_TTL } from './utils/constants';
import { PRODUCTS_NATIVE_QUERIES } from './utils/nativeQueries';
import { redisClient } from 'src/redis/redisClient';

@Injectable()
export class ProductService {
  constructor(
    private readonly productsRepository: ProductRepository,
    private prismaService: PrismaService,
  ) {}

  async getAllProducts(filters: GetAllProductsDTO): Promise<ProductDTO[]> {
    try {
      const whereClause = this.buildWhereClause(filters);

      const products = await this.prismaService.product.findMany({
        where: whereClause,
        take: this.getLimit(filters),
        skip: this.getOffset(filters),
        orderBy: this.getOrderBy(filters),
      });
  
      return products;
    } catch (error) {
      throw new Error(`Error while fetching products: ${error.message}`);
    }
  }

  async getTopOrderedProducts(area: string): Promise<ProductDTO[]> {
    const cacheKey = `top_products:${area}`;
    try {
      const cachedData = await redisClient.get(cacheKey);

      // If data is cached, return it
      if (cachedData) {
        return JSON.parse(cachedData) as ProductDTO[];
      }

      const query = PRODUCTS_NATIVE_QUERIES.TOP_ORDERED_PRODUCTS(area);
      const products = await this.prismaService.$queryRaw<ProductDTO[]>(query);

      // Cache the data for 12 hours
      await redisClient.set(cacheKey, JSON.stringify(products), { EX: TOP_FREQUENTLY_ORDERED_PRODUCTS_TTL });
  
      return products;
    } catch (error) {
      throw new Error(`Error while fetching top ordered products: ${error.message}`);
    }
  }

  async getProductById(id: number): Promise<ProductDTO> {
    return this.productsRepository.findById(id);
  }

  private buildWhereClause(filters: GetAllProductsDTO): Record<string, any> {
    const whereClause: Record<string, any> = {};

    if (filters.categories?.length) {
      whereClause.category = { in: filters.categories };
    }

    return whereClause;
  }

  private getLimit(filters: GetAllProductsDTO): number {
    return filters.limit || DEFAULT_PRODUCTS_LISTING_CONSTANTS.defaultLimit;
  }

  private getOffset(filters: GetAllProductsDTO): number {
    return filters.offset || DEFAULT_PRODUCTS_LISTING_CONSTANTS.defaultOffset;
  }

  private getOrderBy(filters: GetAllProductsDTO): Record<string, any> {
    return {
      [filters.sortBy || DEFAULT_PRODUCTS_LISTING_CONSTANTS.defaultSortBy]:
        filters.sortOrder || DEFAULT_PRODUCTS_LISTING_CONSTANTS.defaultSortOrder,
    };
  }
}
