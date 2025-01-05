import { ApiProperty } from '@nestjs/swagger';

type Duration = `${number}${'m' | 'y' | 'd' | 'w'}`;

export class RequestPeriod {
    @ApiProperty({ description: 'Period of time to build graphic' })
    period: Duration;
}
