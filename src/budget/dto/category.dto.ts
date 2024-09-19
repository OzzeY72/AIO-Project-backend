import { ApiProperty } from '@nestjs/swagger';

export class CategoryDtoResponse {
    @ApiProperty({ description: 'Id of category' })
    id: number;

    @ApiProperty({ description: 'Name of category' })
    name: number;
}

export class CategoryDtoRequest {
  @ApiProperty({ description: 'Name of category' })
  name: number;
}
