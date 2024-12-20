import { IsInt, Min, ValidateNested, IsArray } from "class-validator";
import { Type } from "class-transformer";

class ProductDTO {
    @IsInt()
    productId: number;

    @IsInt()
    @Min(1, { message: "Quantity must be at least 1" })
    quantity: number;
}

export class CreateOrderDTO {
    @IsInt()
    customerId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductDTO)
    products: ProductDTO[];
}
