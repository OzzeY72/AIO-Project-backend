import { ApiProperty } from '@nestjs/swagger';
import { TagDtoResponse, CategoryDtoResponse, toTagDtoResponse, toCategoryDtoResponse } from '@/budget/dto';
import { ProductEntity } from '@/budget/entities';

export class ProductDtoResponse {
    @ApiProperty({ description: 'Id of product' })
    id: number;

    @ApiProperty({ description: 'Name of product' })
    name: string;

    @ApiProperty({ description: 'Price of product' })
    price: number;

    @ApiProperty({ description: 'Date of product when it was added to List' })
    date: Date;

    @ApiProperty({ description: 'List of tags that the product has' })
    tags: TagDtoResponse[];

    @ApiProperty({ description: 'Category of product' })
    category: CategoryDtoResponse;
}

export class ProductDtoRequest {
    @ApiProperty({ description: 'Name of product' })
    name: string;

    @ApiProperty({ description: 'Price of product' })
    price: number;

    @ApiProperty({ description: 'Date of product when it was added to List' })
    date: Date;

    @ApiProperty({ description: 'List of tags that the product must have in array of tags id' })
    tags: number[];

    @ApiProperty({ description: 'Category of product' })
    category: number;

    @ApiProperty({ description: 'UserId can be null' })
    userId?: string;
}

export class ProductUpdateDtoRequest {
    @ApiProperty({ description: 'Id of product' })
    id: number;

    @ApiProperty({ description: 'Name of product' })
    name: string;

    @ApiProperty({ description: 'Price of product' })
    price: number;

    @ApiProperty({ description: 'Date of product when it was added to List' })
    date: Date;

    @ApiProperty({ description: 'List of tags that the product must have in array of tags id' })
    tags: number[];

    @ApiProperty({ description: 'Category of product' })
    category: number;
    
    @ApiProperty({ description: 'UserId can be null' })
    userId?: string;
}

export class ProductGetDtoRequest {
    @ApiProperty({ description: 'For wich month list products' })
    month?: number;

    @ApiProperty({ description: 'For wich year list products' })
    year?: number;

    @ApiProperty({ description: 'List of tags that the product must have in array of tags id' })
    tags?: number[];

    @ApiProperty({ description: 'Category of product' })
    category?: number;
}


export const toProductDtoResponse = (product: ProductEntity) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    date: product.date,
    tags: product.tags.map(toTagDtoResponse),
    category: toCategoryDtoResponse(product.category),
});