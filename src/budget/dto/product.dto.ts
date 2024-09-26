import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TagDtoResponse, CategoryDtoResponse, toTagDtoResponse, toCategoryDtoResponse } from '@/budget/dto';
import { ProductEntity, TagEntity } from '@/budget/entities';


class BaseDto {
    @ApiProperty({ description: 'Name of product' })
    name: string;

    @ApiProperty({ description: 'Price of product' })
    price: number;

    @ApiProperty({ description: 'Date of product when it was added to List' })
    date: Date;
}

export class ProductDtoRequest extends BaseDto {
    @ApiProperty({ description: 'List of tags that the product must have in array of tags id' })
    tags: number[];
}

export class ProductDtoCreateRequest extends BaseDto {
    @ApiProperty({ description: 'List of tags that the product must have in array of tags id', type: [Number] })
    tags: number[];

    @ApiProperty({ description: 'UserId can be null' })
    userId?: string;
}

export class ProductUpdateDtoRequest extends BaseDto {
    @ApiProperty({ description: 'Id of product' })
    id: number;
    
    @ApiProperty({ description: 'List of tags that the product must have in array of tags id' })
    tags: number[];

    @ApiProperty({ description: 'UserId can be null' })
    userId?: string;
}

export class ProductDtoResponse extends BaseDto {
    @ApiProperty({ description: 'Id of product' })
    id: number;

    @ApiProperty({ description: 'Tags array with detailed information', type: [TagDtoResponse] })
    tags?: TagDtoResponse[];
}

export class ProductGetDtoRequest {
    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'For wich month list products', required: false})
    month?: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'For wich year list products', required: false })
    year?: number;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'Partial or full name of product', required: false })
    name?: number;

    @IsOptional()
    @ApiProperty({ description: 'List of tags that the product must have in array of tags id', type: [Number], required: false })
    tags?: number[];

    @IsOptional()
    @IsNumber()
    @ApiProperty({ description: 'Category of product', required: false })
    category?: number;
}


export const toProductDtoResponse = (product: ProductEntity): ProductDtoResponse => ({
    id: product.id,
    name: product.name,
    price: product.price,
    date: product.date,
    tags: product.tags.map(toTagDtoResponse),
});