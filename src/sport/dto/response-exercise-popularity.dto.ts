import { ApiProperty } from '@nestjs/swagger';
import { CreateExerciseDto } from './';
import { ResponseExerciseRecordDto } from './response-exercise-record';

export class ResponseExerciseToReps 
{
    @ApiProperty({ description: 'Exercise' })
    exercise: string;
    
    @ApiProperty({ description: 'Count of reps' })
    reps: number;
}

export class ResponseExercisePopularity {
    @ApiProperty({ description: 'Array of pairs - exercise:count of reps' })
    pairs: ResponseExerciseToReps[];
}
