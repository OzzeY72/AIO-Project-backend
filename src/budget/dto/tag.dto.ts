import { ApiProperty } from '@nestjs/swagger';
import { TagEntity } from '@/budget/entities';

export class TagDtoResponse {
    @ApiProperty({ description: 'Id of tag' })
    id: number;

    @ApiProperty({ description: 'Name of tag' })
    name: string;

    @ApiProperty({ description: 'Color of tag' })
    color: string | null;

    @ApiProperty({ description: 'UserId can be null' })
    userId?: string;
}

export class TagDtoRequest {
    @ApiProperty({ description: 'Name of tag' })
    name: string;

    @ApiProperty({ description: 'Color of tag' })
    color?: string;

    @ApiProperty({ description: 'UserId can be null' })
    userId?: string;
}

export const toTagDtoResponse = (tag: TagEntity) => ({
    id: tag.id,
    name: tag.name,
    color: tag.color,
});
