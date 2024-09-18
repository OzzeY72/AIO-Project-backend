import { ApiProperty } from '@nestjs/swagger';

export class HealthRegisterDataDto {
    @ApiProperty({ description: 'Count of bad thing per day' })
    countPerDay: number;

    @ApiProperty({ description: 'Price per one thing' })
    pricePerThing: number;
}