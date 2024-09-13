import { ApiProperty } from '@nestjs/swagger';

export class HealthStatDto {
    @ApiProperty({ description: 'Total days of not doing something bad for health' })
    totalDays: number;

    @ApiProperty({ description: 'Longest streak' })
    longestStreak: number;
}