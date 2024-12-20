import { Prisma } from '@prisma/client';

export const PRODUCTS_NATIVE_QUERIES = {
    TOP_ORDERED_PRODUCTS: (area: string) => {
        return Prisma.sql`
        SELECT 
            p.id, 
            p.name, 
            p.category, 
            p.area, 
            p.createdAt
        FROM 
            OrderItem oi
        INNER JOIN 
            Product p ON oi.productId = p.id
        WHERE 
            p.area = ${area}
        GROUP BY 
            p.id
        ORDER BY 
            COUNT(oi.productId) DESC
        LIMIT 10;
        `;
    }
};