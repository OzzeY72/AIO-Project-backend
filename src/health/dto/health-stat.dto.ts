import { ApiProperty } from '@nestjs/swagger';

export class HealthStatDto {
    @ApiProperty({ description: 'Total days of not doing something bad for health' })
    totalDays: number;

    @ApiProperty({ description: 'Longest streak' })
    longestStreak: number;
}

export class CompleteStatDto {
    @ApiProperty({ description: 'Total days of not doing something bad for health' })
    totalDays: number;

    @ApiProperty({ description: 'Longest streak' })
    longestStreak: number;

    @ApiProperty({ description: 'Last day with bad habit' })
    lastBadDay: Date;

    @ApiProperty({ description: 'Days from begining of all streaks' })
    lastStreakDays: number;

    @ApiProperty({ description: 'Bad thing count' })
    badThingCount: number;

    @ApiProperty({ description: 'Money saved' })
    moneySaved: number;
}