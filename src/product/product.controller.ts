import { Controller, Get, Param, Query, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { GetAllProductsDTO } from './dto/get-all-products.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get()
  async getAllProducts(
    @Query(new ValidationPipe({ transform: true })) filters: GetAllProductsDTO
  ) {
    return this.productsService.getAllProducts(filters);
  }

  @Get('top-ordered')
  async getTopOrderedProducts(@Query('area') area: string) {
    return this.productsService.getTopOrderedProducts(area);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(Number(id));
  }
}
