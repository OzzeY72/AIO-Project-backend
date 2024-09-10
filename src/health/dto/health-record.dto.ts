import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class HealthRecordDto {
    @ApiProperty({ description: 'Id of healthrercord' })
    id: number;

    @ApiProperty({ description: 'Day of begging of streak' })
    @IsString()
    streakBegin: string;

    @ApiProperty({ description: 'Day of streak ending' })
    @IsString()
    streakEnd: string;
}