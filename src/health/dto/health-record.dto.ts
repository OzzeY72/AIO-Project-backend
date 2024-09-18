import { ApiProperty } from '@nestjs/swagger';

export class HealthRecordDto {
    @ApiProperty({ description: 'Id of healthrercord' })
    id: number;

    @ApiProperty({ description: 'Day of begging of streak' })
    streakBegin: Date;

    @ApiProperty({ description: 'Day of streak ending' })
    streakEnd: Date;
}

export class HealthStreakDto {
    @ApiProperty({ description: 'HealthId for manipulation with streaks' })
    healthId: number;
}