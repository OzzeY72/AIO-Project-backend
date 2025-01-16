import { ApiProperty } from '@nestjs/swagger';

export class RequestDayMaxWeightOnReps {
    @ApiProperty({ description: 'Start date of time to build graphic' })
    start: Date;

    @ApiProperty({ description: 'End date of time to build graphic' })
    end?: Date;

    @ApiProperty({ description: 'Name of exercise to build graphic' })
    exercise: string;

    @ApiProperty({ description: 'Number of reps which is enough to build graphic' })
    reps?: number;
}
