import { ApiProperty } from '@nestjs/swagger';
import { CategoryEntity } from '@/budget/entities';

export class CategoryDtoResponse {
    @ApiProperty({ description: 'Id of category' })
    id: number;

    @ApiProperty({ description: 'Name of category' })
    name: string;
}

export class CategoryDtoRequest {
    @ApiProperty({ description: 'Name of category' })
    name: string;
}

export const toCategoryDtoResponse = (category: CategoryEntity) => ({
    id: category?.id,
    name: category?.name,
});