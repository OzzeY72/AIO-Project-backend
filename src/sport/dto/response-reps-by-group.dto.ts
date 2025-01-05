import { ApiProperty } from '@nestjs/swagger';
import { CreateMuscleGroupDto } from './';

export class ResponseRepsToGroup
{
    @ApiProperty({ description: 'Group of muscle' })
    muscleGroup: string;
    
    @ApiProperty({ description: 'Count of reps' })
    reps: number;
}

export class ResponseRepsByGroup {
    @ApiProperty({ description: 'Array of pairs - Group of muscle:count of reps' })
    pairs: ResponseRepsToGroup[];
}
