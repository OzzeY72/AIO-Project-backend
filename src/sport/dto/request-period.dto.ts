import { ApiProperty } from '@nestjs/swagger';

export class RequestPeriod {
    @ApiProperty({ description: 'Start date of time to build graphic' })
    start: Date;

    @ApiProperty({ description: 'End date of time to build graphic' })
    end?: Date;
}
