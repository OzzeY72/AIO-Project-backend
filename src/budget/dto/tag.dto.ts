import { ApiProperty } from '@nestjs/swagger';

export class TagDtoResponse {
    @ApiProperty({ description: 'Id of tag' })
    id: number;

    @ApiProperty({ description: 'Name of tag' })
    name: number;

    @ApiProperty({ description: 'Color of tag' })
    color: string | null;
}

export class TagDtoRequest {
    @ApiProperty({ description: 'Name of tag' })
    name: number;

    @ApiProperty({ description: 'Color of tag' })
    color?: string;
}
