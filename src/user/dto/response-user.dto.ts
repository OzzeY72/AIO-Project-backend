import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty({ example: 'regular@mail.com', description: 'Email' })
    email: string;
    @ApiProperty({ example: 'John43', description: 'Nickname' })
    name: string;
    @ApiProperty({ example: 'a48c8910-9ff2-4a84-ae15-fdce540f4455', description: 'userId in our system' })
    userId: string;
    @ApiProperty({ example: 'https://e7.pngegg.com/pngimages/251/239/png-clipart-logo-design-rebranding-typography-letter-a-angle-text-thumbnail.png', description: 'Link to Image' })
    userLogo: string;
}

export class UserCreateDto {
    email: string;
    name: string;
    provider: string;
    providerId: string;
    userLogo: string;
    userId: string;
}