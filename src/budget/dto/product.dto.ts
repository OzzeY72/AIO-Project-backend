import { ApiProperty } from '@nestjs/swagger';
import { TagDtoResponse, CategoryDtoResponse } from '@/budget';

export class ProductDtoResponse {
    @ApiProperty({ description: 'Id of product' })
    id: number;

    @ApiProperty({ description: 'Name of product' })
    name: number;

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
    name: number;

    @ApiProperty({ description: 'Price of product' })
    price: number;

    @ApiProperty({ description: 'List of tags that the product must have in array of tags id' })
    tags: number[];

    @ApiProperty({ description: 'Category of product' })
    category: number;
}
