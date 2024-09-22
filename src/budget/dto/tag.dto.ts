import { ApiProperty } from '@nestjs/swagger';
import { TagEntity } from '@/budget/entities';
import { CategoryDtoResponse, toCategoryDtoResponse } from './category.dto';

class BaseDto {
    @ApiProperty({ description: 'Name of tag' })
    name: string;

    @ApiProperty({ description: 'Color of tag' })
    color: string | null;
}

export class TagDtoResponse extends BaseDto{
    @ApiProperty({ description: 'Id of tag' })
    id: number;

    @ApiProperty({ description: 'UserId can be null' })
    userId?: string;

    @ApiProperty({ description: 'Category' })
    category: CategoryDtoResponse;
}

export class TagDtoRequest extends BaseDto{
    @ApiProperty({ description: 'Category id' })
    categoryId: number;

    @ApiProperty({ description: 'UserId can be null' })
    userId?: string;
}

export class TagDtoUpdateRequest extends BaseDto{
    @ApiProperty({ description: 'Category' })
    category: CategoryDtoResponse;
}

export const toTagDtoResponse = (tag: TagEntity): TagDtoResponse => ({
    id: tag.id,
    name: tag.name,
    color: tag.color,
    category: toCategoryDtoResponse(tag.category)
});
