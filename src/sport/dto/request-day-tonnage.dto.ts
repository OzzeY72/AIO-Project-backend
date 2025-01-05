import { ApiProperty } from '@nestjs/swagger';

type Duration = `${number}${'m' | 'y' | 'd' | 'w'}`;

export class RequestDayTonnage {
    @ApiProperty({ description: 'Period of time to build graphic' })
    period: Duration;

    @ApiProperty({ description: 'Name of exercise to build graphic' })
    exercise: string;
}
